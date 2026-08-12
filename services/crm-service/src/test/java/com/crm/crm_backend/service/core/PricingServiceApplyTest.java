package com.crm.crm_backend.service.core;

import com.crm.crm_backend.cache.PricingCache;
import com.crm.crm_backend.dto.request.PricingApplyRequestDTO;
import com.crm.crm_backend.dto.response.PricingApplyResponseDTO;
import com.crm.crm_backend.model.entity.PricingRule;
import com.crm.crm_backend.model.enums.PricingRuleType;
import com.crm.crm_backend.repository.PricingRuleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PricingServiceApplyTest {

    @Mock
    private PricingRuleRepository pricingRuleRepository;

    @Mock
    private PricingCache pricingCache;

    @InjectMocks
    private PricingService pricingService;

    @BeforeEach
    void setUp() {
        PricingRule rule = PricingRule.builder()
                .id(1L)
                .code("DISC10")
                .name("10% off")
                .ruleType(PricingRuleType.PERCENTAGE_DISCOUNT)
                .value(new BigDecimal("10"))
                .priority(1)
                .active(true)
                .build();
        when(pricingCache.snapshot()).thenReturn(List.of(rule));
    }

    @Test
    void applyPricing_appliesPercentageDiscount() {
        PricingApplyRequestDTO request = new PricingApplyRequestDTO();
        request.setBaseAmount(new BigDecimal("100.00"));

        PricingApplyResponseDTO result = pricingService.applyPricing(request);

        assertThat(result.getFinalAmount()).isEqualByComparingTo("90.00");
        assertThat(result.getAdjustment()).isEqualByComparingTo("-10.00");
        assertThat(result.getAppliedRuleCode()).isEqualTo("DISC10");
    }
}
