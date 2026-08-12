package com.crm.crm_backend.service.core;

import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.CustomerSegment;
import com.crm.crm_backend.model.enums.SegmentCriteriaType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Evaluates whether a customer matches a segment's criteriaType + criteriaValue.
 */
@Component
public class SegmentCriteriaEvaluator {

    public boolean matches(Customer customer, CustomerSegment segment) {
        if (customer == null || segment == null || segment.getCriteriaType() == null) {
            return false;
        }

        String expected = segment.getCriteriaValue();
        if (expected == null || expected.isBlank()) {
            return false;
        }

        expected = expected.trim();
        SegmentCriteriaType type = segment.getCriteriaType();

        return switch (type) {
            case CUSTOMER_TYPE -> enumEquals(customer.getCustomerType(), expected);
            case INDUSTRY -> equalsIgnoreCase(customer.getIndustry(), expected);
            case STATUS -> enumEquals(customer.getStatus(), expected);
            case REGION -> matchesRegion(customer, expected);
            case REVENUE, CUSTOMER_VALUE -> revenueAtLeast(customer.getAnnualRevenue(), expected);
            case CUSTOM -> equalsIgnoreCase(customer.getIndustry(), expected)
                    || equalsIgnoreCase(customer.getCompanyName(), expected)
                    || equalsIgnoreCase(customer.getCustomerPriority(), expected);
            case CAMPAIGN, PURCHASE_FREQUENCY, LAST_PURCHASE -> false;
        };
    }

    private boolean matchesRegion(Customer customer, String expected) {
        return equalsIgnoreCase(customer.getCountry(), expected)
                || equalsIgnoreCase(customer.getState(), expected)
                || equalsIgnoreCase(customer.getCity(), expected);
    }

    private boolean revenueAtLeast(BigDecimal annualRevenue, String expected) {
        if (annualRevenue == null) {
            return false;
        }
        try {
            BigDecimal threshold = new BigDecimal(expected.replace(",", "").trim());
            return annualRevenue.compareTo(threshold) >= 0;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private boolean enumEquals(Enum<?> value, String expected) {
        return value != null && value.name().equalsIgnoreCase(expected);
    }

    private boolean equalsIgnoreCase(String actual, String expected) {
        return actual != null
                && actual.trim().equalsIgnoreCase(expected.trim());
    }
}
