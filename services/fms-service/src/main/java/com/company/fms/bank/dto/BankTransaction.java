package com.company.fms.bank.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record BankTransaction(
        String id,
        String referenceNumber,
        String description,
        String type,
        Instant date,
        BigDecimal amount,
        boolean reconciled,
        String invoiceNumber) {

    public static BankTransaction from(String id, String referenceNumber, String description, String type,
            Instant date, BigDecimal amount, boolean reconciled, String invoiceNumber) {
        return new BankTransaction(id, referenceNumber, description, type, date, amount, reconciled, invoiceNumber);
    }
}
