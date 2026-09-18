package com.company.fms.receivable.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.company.fms.receivable.Customer;

public record CustomerResponse(
        String id,
        String customerCode,
        String customerName,
        String contactPerson,
        String email,
        String phoneNumber,
        String address,
        String taxId,
        String status,
        BigDecimal arBalance,
        String createdBy,
        Instant createdAt,
        Instant updatedAt) {

    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getCustomerCode(),
                customer.getCustomerName(),
                customer.getContactName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getTaxId(),
                customer.getStatus(),
                customer.getArBalance(),
                customer.getCreatedBy(),
                customer.getCreatedAt(),
                customer.getUpdatedAt());
    }
}
