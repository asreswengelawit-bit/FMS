package com.company.mms.warehouse.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateWarehouseRequest(
        @NotBlank(message = "Warehouse code is required")
        @Size(max = 50, message = "Warehouse code must not exceed 50 characters")
        @Pattern(regexp = "[A-Za-z0-9][A-Za-z0-9_-]*", message = "Warehouse code may contain letters, numbers, hyphens, and underscores")
        String id,

        @NotBlank(message = "Warehouse name is required")
        @Size(max = 200, message = "Warehouse name must not exceed 200 characters")
        String name,

        @NotBlank(message = "Location is required")
        @Size(max = 255, message = "Location must not exceed 255 characters")
        String location,

        @NotBlank(message = "Warehouse type is required")
        @Size(max = 50, message = "Warehouse type must not exceed 50 characters")
        String type,

        @NotNull(message = "Capacity is required")
        @DecimalMin(value = "0.01", message = "Capacity must be greater than zero")
        @Digits(integer = 13, fraction = 2, message = "Capacity must have at most 13 integer and 2 decimal digits")
        BigDecimal capacity,

        @NotBlank(message = "Manager is required")
        @Size(max = 200, message = "Manager must not exceed 200 characters")
        String manager,

        Boolean active) {
}
