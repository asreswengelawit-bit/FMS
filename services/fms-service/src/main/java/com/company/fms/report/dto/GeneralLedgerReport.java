package com.company.fms.report.dto;

import java.math.BigDecimal;
import java.util.List;

public record GeneralLedgerReport(
        String accountId,
        String accountCode,
        String accountName,
        String periodId,
        String periodName,
        BigDecimal openingBalance,
        BigDecimal debitTurnover,
        BigDecimal creditTurnover,
        BigDecimal closingBalance,
        List<LedgerLine> lines) {

    public record LedgerLine(
            String id,
            String journalId,
            String date,
            String description,
            BigDecimal debit,
            BigDecimal credit,
            BigDecimal balance) {
    }
}
