package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.PricingApplyRequestDTO;
import com.crm.crm_backend.dto.request.QuotationCreateDTO;
import com.crm.crm_backend.dto.request.QuotationItemRequestDTO;
import com.crm.crm_backend.dto.response.PricingApplyResponseDTO;
import com.crm.crm_backend.dto.response.QuotationResponseDTO;
import com.crm.crm_backend.mapper.QuotationMapper;
import com.crm.crm_backend.mapper.SalesOrderMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Opportunity;
import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.OpportunityRepository;
import com.crm.crm_backend.repository.QuotationRepository;
import com.crm.crm_backend.repository.SalesOrderRepository;
import com.crm.crm_backend.validator.QuotationValidator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuotationServicePricingWiringTest {

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

    @Test
    void createQuotation_appliesPricingRulesToLineItems() {
        Customer customer = new Customer();
        customer.setId(1L);
        Opportunity opportunity = Opportunity.builder().id(2L).build();

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(opportunityRepository.findById(2L)).thenReturn(Optional.of(opportunity));
        doNothing().when(quotationValidator).validateCreate(any());
        when(quotationMapper.toEntity(any(QuotationCreateDTO.class))).thenReturn(new Quotation());
        when(quotationRepository.save(any(Quotation.class))).thenAnswer(inv -> {
            Quotation q = inv.getArgument(0);
            q.setId(50L);
            return q;
        });
        when(salesOrderRepository.findByQuotationId(50L)).thenReturn(Optional.empty());
        when(quotationMapper.toResponseDTO(any(Quotation.class))).thenReturn(new QuotationResponseDTO());

        when(pricingService.applyPricing(any(PricingApplyRequestDTO.class)))
                .thenReturn(PricingApplyResponseDTO.builder()
                        .baseAmount(new BigDecimal("100.00"))
                        .adjustment(new BigDecimal("-10.00"))
                        .finalAmount(new BigDecimal("90.00"))
                        .appliedRuleId(7L)
                        .appliedRuleCode("DISC10")
                        .build());

        QuotationItemRequestDTO item = new QuotationItemRequestDTO();
        item.setItemName("License");
        item.setSku("SKU-1");
        item.setQuantity(2);
        item.setUnitPrice(new BigDecimal("50.00"));

        QuotationCreateDTO dto = new QuotationCreateDTO();
        dto.setCustomerId(1L);
        dto.setOpportunityId(2L);
        dto.setIssueDate(LocalDate.now());
        dto.setExpiryDate(LocalDate.now().plusDays(10));
        dto.setTax(BigDecimal.ZERO);
        dto.setDiscount(BigDecimal.ZERO);
        dto.setItems(List.of(item));

        quotationService.createQuotation(dto);

        ArgumentCaptor<Quotation> captor = ArgumentCaptor.forClass(Quotation.class);
        verify(quotationRepository).save(captor.capture());
        Quotation saved = captor.getValue();

        assertThat(saved.getItems()).hasSize(1);
        assertThat(saved.getItems().getFirst().getTotalPrice()).isEqualByComparingTo("90.00");
        assertThat(saved.getItems().getFirst().getUnitPrice()).isEqualByComparingTo("45.00");
        assertThat(saved.getSubtotal()).isEqualByComparingTo("90.00");
        assertThat(saved.getTotalAmount()).isEqualByComparingTo("90.00");
    }
}
