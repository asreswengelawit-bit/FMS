package com.company.fms.budget.dto;

import java.math.BigDecimal;
import java.util.List;

public record BudgetVarianceReport(
        String budgetId,
        int fiscalYear,
        String periodId,
        String periodName,
        List<Item> items,
        BigDecimal totalBudget,
        BigDecimal totalActual,
        BigDecimal totalVariance) {

    public record Item(
            String accountId,
            String accountCode,
            String accountName,
            BigDecimal budgetAmount,
            BigDecimal actualAmount,
            BigDecimal variance,
            BigDecimal variancePercent) {
    }
}
