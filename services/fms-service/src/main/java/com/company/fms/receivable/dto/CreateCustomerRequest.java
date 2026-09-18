package com.company.fms.receivable.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCustomerRequest(
        @NotBlank String customerCode,
        @NotBlank String customerName,
        String contactPerson,
        String email,
        String phoneNumber,
        String address,
        String taxId) {
}
