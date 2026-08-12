package com.company.mms.requisition.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record RequisitionResponse(
        String id,
        String requestedBy,
        String department,
        String materialId,
        String materialName,
        String item,
        BigDecimal quantity,
        BigDecimal qty,
        LocalDate requiredDate,
        String date,
        String priority,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
