package com.company.mms.item.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record MaterialResponse(
        String id,
        String name,
        String category,
        String unitOfMeasure,
        String uom,
        BigDecimal unitCost,
        BigDecimal reorderLevel,
        BigDecimal onHand,
        BigDecimal reserved,
        BigDecimal available,
        String warehouse,
        String status,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
