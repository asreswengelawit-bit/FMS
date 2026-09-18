package com.company.fms.journal.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.company.fms.journal.AccountingPeriod;

public record AccountingPeriodResponse(
        String id,
        String periodName,
        LocalDate startDate,
        LocalDate endDate,
        String status,
        String openedBy,
        String closedBy,
        Instant openedAt,
        Instant closedAt) {

    public static AccountingPeriodResponse from(AccountingPeriod period) {
        return new AccountingPeriodResponse(
                period.getId(),
                period.getPeriodName(),
                period.getStartDate(),
                period.getEndDate(),
                period.getStatus(),
                period.getOpenedBy(),
                period.getClosedBy(),
                period.getOpenedAt(),
                period.getClosedAt());
    }
}
