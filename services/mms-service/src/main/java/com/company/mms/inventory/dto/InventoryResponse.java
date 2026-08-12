package com.company.mms.inventory.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record InventoryResponse(
        Long id,
        String materialId,
        String materialName,
        String warehouseId,
        String warehouseName,
        BigDecimal onHand,
        BigDecimal reserved,
        BigDecimal available,
        BigDecimal reorderLevel,
        String unitOfMeasure,
        BigDecimal unitCost,
        BigDecimal inventoryValue,
        String status,
        long version,
        Instant updatedAt) {
}
