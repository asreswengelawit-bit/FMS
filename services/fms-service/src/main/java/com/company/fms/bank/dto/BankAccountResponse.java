package com.company.fms.bank.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.company.fms.shared.BankAccount;

public record BankAccountResponse(
        String id,
        String accountName,
        String bankName,
        String accountNumber,
        String branchCode,
        String currency,
        BigDecimal openingBalance,
        BigDecimal currentBalance,
        String glControlAccountId,
        String glControlAccountCode,
        String status,
        Instant createdAt,
        Instant updatedAt) {

    public static BankAccountResponse from(BankAccount account) {
        return new BankAccountResponse(
                account.getId(),
                account.getAccountName(),
                account.getBankName(),
                account.getAccountNumber(),
                account.getBranch(),
                account.getCurrency(),
                account.getOpeningBalance(),
                account.getCurrentBalance(),
                null,
                null,
                account.isActive() ? "ACTIVE" : "INACTIVE",
                account.getCreatedAt(),
                account.getUpdatedAt());
    }
}
