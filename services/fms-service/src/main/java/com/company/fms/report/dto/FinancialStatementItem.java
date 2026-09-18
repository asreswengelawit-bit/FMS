package com.company.fms.report.dto;

import java.math.BigDecimal;
import java.util.List;

public record FinancialStatementItem(
        String accountId,
        String accountCode,
        String accountName,
        BigDecimal amount,
        int depth) {
}
