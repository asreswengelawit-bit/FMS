package com.company.mms.item.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateMaterialRequest(
        @NotBlank(message = "Item code is required")
        @Size(max = 50, message = "Item code must not exceed 50 characters")
        String id,

        @NotBlank(message = "Item name is required")
        @Size(max = 200, message = "Item name must not exceed 200 characters")
        String name,

        @NotBlank(message = "Category is required")
        @Size(max = 100, message = "Category must not exceed 100 characters")
        String category,

        @NotBlank(message = "Unit of measure is required")
        @Size(max = 30, message = "Unit of measure must not exceed 30 characters")
        String unitOfMeasure,

        @NotNull(message = "Unit cost is required")
        @DecimalMin(value = "0.0", message = "Unit cost must be greater than or equal to 0")
        BigDecimal unitCost,

        @NotNull(message = "Reorder level is required")
        @DecimalMin(value = "0.0", message = "Reorder level must be greater than or equal to 0")
        BigDecimal reorderLevel,

        String warehouse
) {
}
