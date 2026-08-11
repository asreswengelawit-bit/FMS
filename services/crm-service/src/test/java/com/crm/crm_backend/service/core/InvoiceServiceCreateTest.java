package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.InvoiceCreateDTO;
import com.crm.crm_backend.dto.response.InvoiceResponseDTO;
import com.crm.crm_backend.event.publisher.InvoiceEventPublisher;
import com.crm.crm_backend.mapper.InvoiceMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.model.enums.OrderStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.InvoiceRepository;
import com.crm.crm_backend.repository.SalesOrderRepository;
import com.crm.crm_backend.validator.InvoiceValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceCreateTest {

    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private SalesOrderRepository salesOrderRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private InvoiceMapper invoiceMapper;
    @Mock
    private InvoiceEventPublisher invoiceEventPublisher;
    @Mock
    private InvoiceValidator invoiceValidator;

    @InjectMocks
    private InvoiceService invoiceService;

    private SalesOrder order;
    private Customer customer;
    private InvoiceCreateDTO dto;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setId(10L);

        order = SalesOrder.builder()
                .id(5L)
                .orderNumber("SO-5")
                .status(OrderStatus.APPROVED)
                .subtotal(new BigDecimal("100"))
                .totalAmount(new BigDecimal("100"))
                .build();

        dto = new InvoiceCreateDTO();
        dto.setSalesOrderId(5L);
        dto.setCustomerId(10L);
        dto.setTaxAmount(new BigDecimal("15"));
        dto.setDiscountAmount(BigDecimal.ZERO);
    }

    @Test
    void createInvoiceFromApprovedOrderSetsDraftBalancesAndPublishes() {
        when(salesOrderRepository.findById(5L)).thenReturn(Optional.of(order));
        doNothing().when(invoiceValidator).validateCanCreateFromOrder(order);
        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));

        Invoice mapped = new Invoice();
        when(invoiceMapper.toEntity(dto)).thenReturn(mapped);
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice invc = inv.getArgument(0);
            invc.setId(50L);
            return invc;
        });

        InvoiceResponseDTO response = new InvoiceResponseDTO();
        response.setId(50L);
        response.setStatus(InvoiceStatus.DRAFT);
        when(invoiceMapper.toResponseDTO(any(Invoice.class))).thenReturn(response);

        InvoiceResponseDTO result = invoiceService.createInvoice(dto);

        assertEquals(InvoiceStatus.DRAFT, result.getStatus());

        ArgumentCaptor<Invoice> captor = ArgumentCaptor.forClass(Invoice.class);
        verify(invoiceRepository).save(captor.capture());
        Invoice saved = captor.getValue();
        assertEquals(InvoiceStatus.DRAFT, saved.getStatus());
        assertEquals(0, new BigDecimal("115").compareTo(saved.getTotalAmount()));
        assertEquals(0, BigDecimal.ZERO.compareTo(saved.getPaidAmount()));
        assertEquals(0, new BigDecimal("115").compareTo(saved.getBalanceAmount()));
        verify(invoiceEventPublisher).publishInvoiceCreated(saved);
    }

    @Test
    void createInvoiceRejectedWhenOrderNotApproved() {
        order.setStatus(OrderStatus.DRAFT);
        when(salesOrderRepository.findById(5L)).thenReturn(Optional.of(order));
        doThrow(new IllegalStateException("Invoice can only be created from an APPROVED (or later) sales order"))
                .when(invoiceValidator).validateCanCreateFromOrder(order);

        assertThrows(IllegalStateException.class, () -> invoiceService.createInvoice(dto));
        verify(invoiceRepository, never()).save(any());
        verify(invoiceEventPublisher, never()).publishInvoiceCreated(any());
    }
}
