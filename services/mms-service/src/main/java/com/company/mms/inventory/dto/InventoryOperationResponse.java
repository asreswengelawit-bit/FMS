package com.company.mms.inventory.dto;

import com.company.mms.stockmovement.dto.StockMovementResponse;

public record InventoryOperationResponse(
        InventoryResponse inventory,
        StockMovementResponse movement) {
}
