package com.company.mms.goodsreceipt.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GoodsReceiptLineRequest(
        @NotBlank(message = "Material ID/Item code is required")
        String materialId,

        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
        BigDecimal quantity,

        @DecimalMin(value = "0.0", message = "Unit cost cannot be negative")
        BigDecimal unitCost
) {
}
