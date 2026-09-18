package com.company.fms.bank.dto;

import java.math.BigDecimal;
import java.util.List;

public record BankReconciliationSummary(
        String accountId,
        String accountName,
        BigDecimal bookBalance,
        BigDecimal statementEndingBalance,
        BigDecimal totalCredits,
        BigDecimal totalDebits,
        long matchedTransactions,
        long unmatchedTransactions,
        List<BankTransaction> transactions) {
}
