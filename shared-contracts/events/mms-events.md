# MMS Events

**Producer:** `mms-service` · Exchange: `mms.events` (topic). MMS owns these contracts; consumers
(PRMS, FMS, CRM) review changes. Envelope per [event-contracts](../../docs/architecture/event-contracts.md).

## Published
### `StockReceived`
Routing key: `mms.stock.received` — **consumed by PRMS** (close PO) and **FMS** (inventory/payable).
Example: [`examples/stock-received.json`](../examples/stock-received.json).
```json
{ "goodsReceiptId": 88, "purchaseOrderId": 102, "warehouseId": 2, "receiptDate": "2026-07-09",
  "lines": [ { "itemId": 501, "quantityReceived": 100 } ] }
```

### `InventoryAdjusted`
Routing key: `mms.inventory.adjusted`
```json
{ "itemId": 501, "warehouseId": 2, "delta": -3, "reason": "DAMAGE", "quantityOnHand": 97 }
```

### `GoodsIssued`
Routing key: `mms.goods.issued` — issue out of stock (e.g. against a sales order).
```json
{ "stockMovementId": 320, "itemId": 501, "warehouseId": 2, "quantity": 10, "reference": "SO-0007" }
```

## Consumed
### `PurchaseOrderApproved` (from PRMS)
Routing key: `prms.purchase-order.approved` — create an expected goods receipt so the warehouse can
receive against the PO.
