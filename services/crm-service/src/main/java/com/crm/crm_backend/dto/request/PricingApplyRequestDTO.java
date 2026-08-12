package com.crm.crm_backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PricingApplyRequestDTO {

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal baseAmount;

    private String productSku;
}
