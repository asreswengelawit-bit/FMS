package com.crm.crm_backend.validator;

import com.crm.crm_backend.dto.request.CustomerCreateDTO;
import com.crm.crm_backend.dto.request.CustomerUpdateDTO;
import com.crm.crm_backend.model.entity.Customer;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CustomerValidator {

    public void validateCreate(CustomerCreateDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalStateException("Customer email is required");
        }
        if (dto.getPhone() == null || dto.getPhone().isBlank()) {
            throw new IllegalStateException("Customer phone is required");
        }
        if (dto.getCustomerName() == null || dto.getCustomerName().isBlank()) {
            throw new IllegalStateException("Customer name is required");
        }
    }

    public void validateUpdate(Customer existing, CustomerUpdateDTO dto) {
        if (existing == null) {
            throw new IllegalStateException("Customer is required");
        }
        if (existing.isDeleted()) {
            throw new IllegalStateException("Cannot update a deleted customer");
        }
        if (dto.getEmail() != null && dto.getEmail().isBlank()) {
            throw new IllegalStateException("Customer email cannot be blank");
        }
    }

    public void validateAmounts(Customer customer) {
        if (customer == null) {
            return;
        }
        assertNonNegative("creditLimit", customer.getCreditLimit());
        assertNonNegative("annualRevenue", customer.getAnnualRevenue());
        assertNonNegative("currentBalance", customer.getCurrentBalance());
    }

    private void assertNonNegative(String field, BigDecimal value) {
        if (value != null && value.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException(field + " cannot be negative");
        }
    }
}
