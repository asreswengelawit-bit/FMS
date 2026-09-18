package com.company.fms.payable.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateVendorRequest(
        @NotBlank String vendorCode,
        @NotBlank String vendorName,
        String contactPerson,
        String email,
        String phoneNumber,
        String address,
        String taxId) {
}
