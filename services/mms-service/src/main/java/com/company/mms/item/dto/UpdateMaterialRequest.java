package com.company.mms.item.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

public record UpdateMaterialRequest(
        @Size(max = 200, message = "Item name must not exceed 200 characters")
        String name,

        @Size(max = 100, message = "Category must not exceed 100 characters")
        String category,

        @Size(max = 30, message = "Unit of measure must not exceed 30 characters")
        String unitOfMeasure,

        @DecimalMin(value = "0.0", message = "Unit cost must be greater than or equal to 0")
        BigDecimal unitCost,

        @DecimalMin(value = "0.0", message = "Reorder level must be greater than or equal to 0")
        BigDecimal reorderLevel,

        Boolean active,

        String warehouse
) {
}
