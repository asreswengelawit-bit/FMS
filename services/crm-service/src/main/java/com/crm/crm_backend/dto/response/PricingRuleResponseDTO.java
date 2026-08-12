package com.crm.crm_backend.dto.response;

import com.crm.crm_backend.model.enums.PricingRuleType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PricingRuleResponseDTO {

    private Long id;
    private String code;
    private String name;
    private PricingRuleType ruleType;
    private BigDecimal value;
    private BigDecimal minOrderAmount;
    private BigDecimal maxAdjustment;
    private String productSku;
    private Integer priority;
    private Boolean active;
    private LocalDate validFrom;
    private LocalDate validTo;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
