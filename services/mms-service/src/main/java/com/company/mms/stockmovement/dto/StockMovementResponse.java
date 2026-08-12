package com.company.mms.stockmovement.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record StockMovementResponse(
        String id,
        String type,
        String materialId,
        String item,
        BigDecimal quantity,
        BigDecimal qty,
        String warehouseId,
        String warehouse,
        String referenceNumber,
        String ref,
        LocalDate movementDate,
        LocalDate date,
        String processedBy,
        String by,
        String notes,
        String note,
        Instant createdAt) {
}
