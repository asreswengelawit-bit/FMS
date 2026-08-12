package com.crm.crm_backend.validator;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Shared numeric/date helpers used by domain validators.
 */
@Component
public class CustomValidator {

    public void requirePositive(String field, BigDecimal value) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException(field + " must be greater than zero");
        }
    }

    public void requireNonNegative(String field, BigDecimal value) {
        if (value != null && value.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException(field + " cannot be negative");
        }
    }
}
