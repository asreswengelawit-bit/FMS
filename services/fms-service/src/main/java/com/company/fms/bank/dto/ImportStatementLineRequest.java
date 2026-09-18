package com.company.fms.bank.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ImportStatementLineRequest(
        @NotNull LocalDate transactionDate,
        @NotBlank String description,
        @NotNull BigDecimal amount,
        @NotBlank String type,
        String reference) {
}
