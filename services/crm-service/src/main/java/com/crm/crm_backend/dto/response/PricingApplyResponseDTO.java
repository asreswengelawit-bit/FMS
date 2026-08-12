package com.crm.crm_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PricingApplyResponseDTO {

    private BigDecimal baseAmount;
    private BigDecimal adjustment;
    private BigDecimal finalAmount;
    private Long appliedRuleId;
    private String appliedRuleCode;
}
