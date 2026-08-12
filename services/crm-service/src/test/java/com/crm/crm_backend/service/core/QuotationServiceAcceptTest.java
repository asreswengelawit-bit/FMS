package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.response.SalesOrderResponseDTO;
import com.crm.crm_backend.mapper.QuotationMapper;
import com.crm.crm_backend.mapper.SalesOrderMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Opportunity;
import com.crm.crm_backend.model.entity.OrderItem;
import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.model.entity.QuotationItem;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.OrderStatus;
import com.crm.crm_backend.model.enums.QuotationStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.OpportunityRepository;
import com.crm.crm_backend.repository.QuotationRepository;
import com.crm.crm_backend.repository.SalesOrderRepository;
import com.crm.crm_backend.validator.QuotationValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuotationServiceAcceptTest {

    @Mock
    private QuotationRepository quotationRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private OpportunityRepository opportunityRepository;
    @Mock
    private SalesOrderRepository salesOrderRepository;
    @Mock
    private QuotationMapper quotationMapper;
    @Mock
    private SalesOrderMapper salesOrderMapper;
    @Mock
    private QuotationValidator quotationValidator;
    @Mock
    private PricingService pricingService;

    @InjectMocks
    private QuotationService quotationService;

    private Quotation quotation;

    @BeforeEach
    void setUp() {
        Customer customer = new Customer();
        customer.setId(10L);
        Opportunity opportunity = Opportunity.builder().id(20L).build();

        quotation = Quotation.builder()
                .id(1L)
                .quotationNumber("QT-1")
                .customer(customer)
                .opportunity(opportunity)
                .status(QuotationStatus.SENT)
                .expiryDate(LocalDate.now().plusDays(5))
                .subtotal(new BigDecimal("100"))
                .discount(BigDecimal.ZERO)
                .tax(new BigDecimal("15"))
                .totalAmount(new BigDecimal("115"))
                .items(new ArrayList<>())
                .build();

        QuotationItem line = QuotationItem.builder()
                .itemName("CRM License")
                .sku("CRM-LIC-001")
                .quantity(2)
                .unitPrice(new BigDecimal("50"))
                .totalPrice(new BigDecimal("100"))
                .quotation(quotation)
                .build();
        quotation.getItems().add(line);
    }

    @Test
    void acceptQuotationCreatesDraftSalesOrder() {
        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(salesOrderRepository.existsByQuotationId(1L)).thenReturn(false);
        doNothing().when(quotationValidator).validateCanAccept(quotation);
        when(quotationRepository.save(any(Quotation.class))).thenAnswer(inv -> inv.getArgument(0));
        when(salesOrderRepository.save(any(SalesOrder.class))).thenAnswer(inv -> {
            SalesOrder order = inv.getArgument(0);
            order.setId(99L);
            return order;
        });

        SalesOrderResponseDTO response = new SalesOrderResponseDTO();
        response.setId(99L);
        response.setStatus(OrderStatus.DRAFT);
        when(salesOrderMapper.toResponseDTO(any(SalesOrder.class))).thenReturn(response);

        SalesOrderResponseDTO result = quotationService.acceptQuotation(1L);

        assertEquals(99L, result.getId());
        assertEquals(OrderStatus.DRAFT, result.getStatus());
        assertEquals(QuotationStatus.ACCEPTED, quotation.getStatus());

        ArgumentCaptor<SalesOrder> captor = ArgumentCaptor.forClass(SalesOrder.class);
        verify(salesOrderRepository).save(captor.capture());
        SalesOrder saved = captor.getValue();
        assertEquals(OrderStatus.DRAFT, saved.getStatus());
        assertEquals(1, saved.getOrderItems().size());
        OrderItem item = saved.getOrderItems().getFirst();
        assertEquals("CRM-LIC-001", item.getSku());
        assertEquals(2, item.getQuantity());
    }

    @Test
    void acceptQuotationBlockedWhenAlreadyLinked() {
        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(salesOrderRepository.existsByQuotationId(1L)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> quotationService.acceptQuotation(1L));
        verify(salesOrderRepository, never()).save(any());
    }
}
