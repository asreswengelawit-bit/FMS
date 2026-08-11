package com.crm.crm_backend.util.generator;

import com.crm.crm_backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Allocates customer numbers like CUST-2026-000003 by reading the highest
 * existing number for the current year from the DB (survives app restarts).
 */
@Component
@RequiredArgsConstructor
public class CustomerNumberGenerator {

    private static final String PREFIX = "CUST-";

    private final CustomerRepository customerRepository;

    public synchronized String generate() {
        String year = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy"));
        String yearPrefix = PREFIX + year + "-";
        long next = customerRepository
                .findMaxCustomerNumberStartingWith(yearPrefix)
                .map(this::parseSequence)
                .orElse(0L)
                + 1;
        return String.format("%s%06d", yearPrefix, next);
    }

    private long parseSequence(String customerNumber) {
        int dash = customerNumber.lastIndexOf('-');
        if (dash < 0 || dash == customerNumber.length() - 1) {
            return 0L;
        }
        try {
            return Long.parseLong(customerNumber.substring(dash + 1));
        } catch (NumberFormatException ex) {
            return 0L;
        }
    }
}
