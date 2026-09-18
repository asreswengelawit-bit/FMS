package com.company.fms.budget.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.company.fms.budget.Budget;
import com.company.fms.budget.BudgetLine;

public record BudgetResponse(
        String id,
        int fiscalYear,
        String status,
        String description,
        String createdBy,
        String approvedBy,
        Instant createdAt,
        Instant updatedAt,
        List<BudgetLineResponse> lines) {

    public record BudgetLineResponse(
            String id,
            String accountId,
            String accountCode,
            String accountName,
            BigDecimal budgetAmount,
            BigDecimal actualAmount,
            BigDecimal variance) {

        public static BudgetLineResponse from(BudgetLine line) {
            BigDecimal budget = line.getAllocatedAmount();
            BigDecimal actual = line.getPostedAmount().add(line.getPaidAmount());
            return new BudgetLineResponse(
                    line.getId(),
                    line.getAccountId(),
                    line.getAccountCode(),
                    line.getAccountName(),
                    budget,
                    actual,
                    budget.subtract(actual));
        }
    }

    public static BudgetResponse from(Budget budget) {
        return new BudgetResponse(
                budget.getId(),
                parseFiscalYear(budget.getBudgetPeriod()),
                budget.getStatus(),
                budget.getDescription(),
                budget.getCreatedBy(),
                null,
                budget.getCreatedAt(),
                budget.getUpdatedAt(),
                budget.getLines().stream().map(BudgetLineResponse::from).toList());
    }

    private static int parseFiscalYear(String budgetPeriod) {
        if (budgetPeriod == null || budgetPeriod.isBlank()) {
            return 0;
        }
        try {
            return (int) Double.parseDouble(budgetPeriod.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
