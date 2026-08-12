package com.company.mms.warehouse.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record WarehouseResponse(
        String id,
        String name,
        String location,
        BigDecimal capacity,
        BigDecimal used,
        long items,
        String manager,
        String type,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {
}
