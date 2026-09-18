package com.company.fms.budget.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateBudgetRequest(
        @NotNull Integer fiscalYear,
        String description,
        @NotEmpty @Valid List<BudgetLineRequest> lines) {

    public record BudgetLineRequest(
            @NotNull String accountId,
            @NotNull BigDecimal budgetAmount) {
    }
}
