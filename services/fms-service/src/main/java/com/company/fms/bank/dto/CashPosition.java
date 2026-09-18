package com.company.fms.bank.dto;

import java.math.BigDecimal;

public record CashPosition(
        String bankAccountId,
        String accountName,
        BigDecimal bookBalance,
        BigDecimal statementBalance,
        BigDecimal variance,
        long unmatchedLines) {
}
