package com.company.mms.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record StockReceivedEvent(
        String eventId,
        String eventType,
        Instant occurredAt,
        String source,
        Data data
) {
    public record Data(
            String goodsReceiptId,
            String purchaseOrderId,
            String warehouseId,
            String receiptDate,
            List<Line> lines
    ) {}

    public record Line(
            String itemId,
            BigDecimal quantityReceived
    ) {}
}
