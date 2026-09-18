package com.company.fms.journal.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.company.fms.journal.JournalEntry;
import com.company.fms.journal.JournalLine;

public record JournalEntryResponse(
        String id,
        String periodId,
        String periodName,
        String description,
        String status,
        String createdBy,
        String approvedBy,
        Instant postedAt,
        Instant createdAt,
        Instant updatedAt,
        BigDecimal totalDebit,
        BigDecimal totalCredit,
        String reversalOfJournalId,
        boolean isReversal,
        List<JournalLineResponse> lines) {

    public record JournalLineResponse(
            String id,
            String accountId,
            String accountCode,
            String accountName,
            BigDecimal debitAmount,
            BigDecimal creditAmount,
            String description) {

        public static JournalLineResponse from(JournalLine line) {
            return new JournalLineResponse(
                    line.getId(),
                    line.getAccountId(),
                    line.getAccountCode(),
                    line.getAccountName(),
                    line.getDebitAmount(),
                    line.getCreditAmount(),
                    line.getDescription());
        }
    }

    public static JournalEntryResponse from(JournalEntry entry) {
        return new JournalEntryResponse(
                entry.getId(),
                entry.getPeriodId(),
                entry.getPeriodName(),
                entry.getDescription(),
                entry.getStatus(),
                entry.getCreatedBy(),
                entry.getApprovedBy(),
                entry.getPostedAt(),
                entry.getCreatedAt(),
                entry.getUpdatedAt(),
                entry.getTotalDebit(),
                entry.getTotalCredit(),
                entry.getReversalOfJournalId(),
                entry.isReversal(),
                entry.getLines().stream().map(JournalLineResponse::from).toList());
    }
}
