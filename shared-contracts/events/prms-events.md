# PRMS Events

**Producer:** `prms-service` · Exchange: `prms.events` (topic). PRMS owns these contracts; consumers
(MMS, FMS) review changes. Envelope per [event-contracts](../../docs/architecture/event-contracts.md).

## Published
### `PurchaseRequestCreated`
Routing key: `prms.purchase-request.created`
```json
{ "purchaseRequestId": 40, "requesterId": 12, "status": "SUBMITTED" }
```

### `PurchaseOrderApproved`
Routing key: `prms.purchase-order.approved` — **consumed by MMS** (prepare goods receipt) and **FMS**
(expect payable). Example: [`examples/purchase-order-approved.json`](../examples/purchase-order-approved.json).
```json
{ "purchaseOrderId": 102, "supplierId": 7, "warehouseId": 2, "totalAmount": 150000, "currency": "ETB",
  "lines": [ { "itemId": 501, "quantity": 100, "unitPrice": 1500 } ] }
```

## Consumed
### `StockReceived` (from MMS)
Routing key: `mms.stock.received` — move the matching PO to `RECEIVED` / `CLOSED` (full/partial).
