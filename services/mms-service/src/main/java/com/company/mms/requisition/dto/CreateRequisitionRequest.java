package com.company.mms.requisition.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRequisitionRequest(
        @NotBlank(message = "Requested by is required")
        @Size(max = 100, message = "Requested by must not exceed 100 characters")
        String requestedBy,

        @NotBlank(message = "Department is required")
        @Size(max = 100, message = "Department must not exceed 100 characters")
        String department,

        @NotBlank(message = "Material ID or Item name is required")
        String materialId,

        String item,

        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
        BigDecimal quantity,

        @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
        BigDecimal qty,

        LocalDate requiredDate,

        LocalDate date,

        String priority
) {
}
