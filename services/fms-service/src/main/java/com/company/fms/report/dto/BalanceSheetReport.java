package com.company.fms.report.dto;

import java.math.BigDecimal;
import java.util.List;

public record BalanceSheetReport(
        String periodId,
        String periodName,
        List<FinancialStatementItem> assetItems,
        List<FinancialStatementItem> liabilityItems,
        List<FinancialStatementItem> equityItems,
        BigDecimal totalAssets,
        BigDecimal totalLiabilities,
        BigDecimal totalEquity,
        boolean accountingEquationVerifies) {
}
