package com.company.mms.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InventoryQuantityRequest(
        @JsonAlias("item")
        @NotBlank(message = "Material is required")
        @Size(max = 200, message = "Material reference must not exceed 200 characters")
        String materialId,

        @JsonAlias("warehouse")
        @NotBlank(message = "Warehouse is required")
        @Size(max = 50, message = "Warehouse code must not exceed 50 characters")
        String warehouseId,

        @JsonAlias("qty")
        @NotNull(message = "Quantity is required")
        @DecimalMin(value = "0.01", message = "Quantity must be greater than zero")
        @Digits(integer = 13, fraction = 2, message = "Quantity must have at most 13 integer and 2 decimal digits")
        BigDecimal quantity,

        @JsonAlias("ref")
        @NotBlank(message = "Reference number is required")
        @Size(max = 100, message = "Reference number must not exceed 100 characters")
        String referenceNumber,

        @JsonAlias("note")
        @Size(max = 500, message = "Notes must not exceed 500 characters")
        String notes,

        @JsonAlias("date")
        LocalDate movementDate) {
}
