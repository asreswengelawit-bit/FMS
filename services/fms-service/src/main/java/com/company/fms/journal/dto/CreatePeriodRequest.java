package com.company.fms.journal.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePeriodRequest(
        @NotBlank String periodName,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate) {
}
