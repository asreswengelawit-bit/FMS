package com.company.fms.report.dto;

import java.math.BigDecimal;
import java.util.List;

public record IncomeStatementReport(
        String periodId,
        String periodName,
        List<FinancialStatementItem> revenueItems,
        List<FinancialStatementItem> expenseItems,
        BigDecimal totalRevenue,
        BigDecimal totalExpense,
        BigDecimal netIncome) {
}
