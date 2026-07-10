# CRM Events

**Producer:** `crm-service` · Exchange: `crm.events` (topic). CRM owns these contracts; consumers
(FMS, MMS) review changes. Envelope per [event-contracts](../../docs/architecture/event-contracts.md).

## Published
### `CustomerCreated`
Routing key: `crm.customer.created`
```json
{ "customerId": 21, "code": "CUST-0021", "name": "Acme Plc", "creditLimit": 500000, "currency": "ETB" }
```

### `SalesOrderConfirmed`
Routing key: `crm.sales-order.confirmed` — **consumed by FMS** (create AR invoice / receivable) and
**MMS** (reserve / issue stock).
```json
{ "salesOrderId": 7, "orderNumber": "SO-0007", "customerId": 21, "totalAmount": 90000, "currency": "ETB",
  "lines": [ { "itemId": 501, "quantity": 10, "unitPrice": 9000 } ] }
```

## Consumed
### `InventoryAdjusted` (from MMS) — *optional*
Routing key: `mms.inventory.adjusted` — refresh displayed stock availability for sales users.
