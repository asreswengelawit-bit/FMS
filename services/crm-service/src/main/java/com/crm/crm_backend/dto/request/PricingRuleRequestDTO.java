package com.crm.crm_backend.dto.request;

import com.crm.crm_backend.model.enums.PricingRuleType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PricingRuleRequestDTO {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    @NotNull
    private PricingRuleType ruleType;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal value;

    private BigDecimal minOrderAmount;

    private BigDecimal maxAdjustment;

    private String productSku;

    private Integer priority;

    private Boolean active;

    private LocalDate validFrom;

    private LocalDate validTo;

    private String description;
}
