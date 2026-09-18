package com.company.fms.bank.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.company.fms.shared.BankStatementLine;

public record BankStatementLineResponse(
        String id,
        String bankAccountId,
        LocalDate transactionDate,
        String description,
        BigDecimal amount,
        String type,
        String reference,
        String reconciliationStatus,
        String matchedPaymentId,
        Instant createdAt) {

    public static BankStatementLineResponse from(BankStatementLine line) {
        return new BankStatementLineResponse(
                line.getId(),
                line.getBankAccountId(),
                line.getTransactionDate(),
                line.getDescription(),
                line.getAmount(),
                line.getType(),
                line.getReference(),
                line.getReconciliationStatus(),
                line.getMatchedPaymentId(),
                line.getCreatedAt());
    }
}
