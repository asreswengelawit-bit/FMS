package com.company.fms.journal.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateJournalEntryRequest(
        @NotBlank String periodId,
        @NotBlank String description,
        @NotEmpty @Valid List<JournalLineRequest> lines) {

    public record JournalLineRequest(
            @NotBlank String accountId,
            @NotNull BigDecimal debitAmount,
            @NotNull BigDecimal creditAmount,
            String description) {
    }
}
