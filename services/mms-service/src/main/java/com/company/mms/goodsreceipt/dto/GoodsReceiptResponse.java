package com.company.mms.goodsreceipt.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record GoodsReceiptResponse(
        String id,
        String purchaseOrderReference,
        String warehouseId,
        String warehouseName,
        LocalDate receiptDate,
        String receivedBy,
        String status,
        String notes,
        Instant createdAt,
        List<GoodsReceiptLineResponse> lines
) {
}
