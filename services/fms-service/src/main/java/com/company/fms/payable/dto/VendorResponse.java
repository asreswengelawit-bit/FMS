package com.company.fms.payable.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.company.fms.payable.Vendor;

public record VendorResponse(
        String id,
        String vendorCode,
        String vendorName,
        String contactPerson,
        String email,
        String phoneNumber,
        String address,
        String taxId,
        String status,
        BigDecimal apBalance,
        String createdBy,
        Instant createdAt,
        Instant updatedAt) {

    public static VendorResponse from(Vendor vendor) {
        return new VendorResponse(
                vendor.getId(),
                vendor.getVendorCode(),
                vendor.getVendorName(),
                vendor.getContactName(),
                vendor.getEmail(),
                vendor.getPhone(),
                vendor.getAddress(),
                vendor.getTaxId(),
                vendor.getStatus(),
                vendor.getApBalance(),
                vendor.getCreatedBy(),
                vendor.getCreatedAt(),
                vendor.getUpdatedAt());
    }
}
