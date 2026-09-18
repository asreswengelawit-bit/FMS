package com.company.fms.report.dto;

import java.math.BigDecimal;
import java.util.List;

public record TrialBalanceReport(
        String periodId,
        String periodName,
        List<TrialBalanceItem> items,
        BigDecimal totalDebit,
        BigDecimal totalCredit,
        boolean balanced) {

    public record TrialBalanceItem(
            String accountId,
            String accountCode,
            String accountName,
            String accountType,
            BigDecimal openingBalance,
            BigDecimal debitTurnover,
            BigDecimal creditTurnover,
            BigDecimal closingBalance) {
    }
}
