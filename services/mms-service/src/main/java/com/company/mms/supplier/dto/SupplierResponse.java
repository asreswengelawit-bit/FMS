package com.company.mms.supplier.dto;

import java.time.Instant;

public record SupplierResponse(
        String id,
        String name,
        String contactPerson,
        String email,
        String phoneNumber,
        String address,
        String status,
        Instant createdAt,
        Instant updatedAt) {
}
