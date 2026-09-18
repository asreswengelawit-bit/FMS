package com.company.fms.journal.dto;

import java.time.Instant;
import java.util.List;

public record PeriodCloseChecklist(
        String periodId,
        String periodName,
        boolean passed,
        Instant runAt,
        List<ChecklistItem> checklistItems) {

    public record ChecklistItem(String name, String status, String description, String remedyHint) {
    }
}
