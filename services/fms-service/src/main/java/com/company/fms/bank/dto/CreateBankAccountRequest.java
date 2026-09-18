package com.company.fms.bank.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBankAccountRequest(
        @NotBlank String accountName,
        @NotBlank String accountNumber,
        String bankName,
        String branch,
        String branchCode,
        String currency,
        @NotNull BigDecimal openingBalance) {

    public String resolvedBranch() {
        return branchCode != null && !branchCode.isBlank() ? branchCode : branch;
    }
}
