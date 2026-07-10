# Event Contracts

RabbitMQ is the backbone for asynchronous ERP integration. Events let one module notify others
without tight coupling.

## Naming convention
Clear business names in **PascalCase, past tense**: `EmployeeCreated`, `LeaveApproved`,
`PurchaseRequestCreated`, `PurchaseOrderApproved`, `StockReceived`, `InventoryAdjusted`,
`GoodsIssued`, `CustomerCreated`, `SalesOrderConfirmed`, `InvoiceGenerated`, `PaymentRecorded`,
`JournalPosted`, `PayrollProcessed`.

## Payload rules
Every payload includes: event ID, event type, timestamp, source service, business record ID, and the
data consumers need.

```json
{
  "eventId": "uuid",
  "eventType": "PurchaseOrderApproved",
  "occurredAt": "2026-07-08T12:00:00Z",
  "source": "prms-service",
  "data": {
    "purchaseOrderId": 102,
    "supplierId": 7,
    "totalAmount": 150000,
    "currency": "ETB"
  }
}
```

## Contract ownership
The **producing service owns** the event contract; **consumers must review** it before changes are
approved. Contracts are **additive by default** — a breaking change (rename/remove/retype a field)
requires sign-off from every consuming team and a deprecation window where old + new both work.

## Event catalog
| Event | Producer | Consumers | Purpose |
|-------|----------|-----------|---------|
| `EmployeeCreated` / `EmployeeUpdated` | HRM | (reporting) | employee lifecycle |
| `LeaveApproved` | HRM | (reporting) | leave granted |
| `PayrollProcessed` | HRM | FMS | drives salary-expense journal |
| `PurchaseRequestCreated` | PRMS | (reporting) | new internal need |
| `PurchaseOrderApproved` | PRMS | MMS, FMS | prepare receipt; expect payable |
| `StockReceived` | MMS | PRMS, FMS | close PO; inventory/payable posting |
| `InventoryAdjusted` | MMS | (reporting, CRM availability) | stock correction |
| `GoodsIssued` | MMS | FMS, CRM | issue out of stock |
| `CustomerCreated` | CRM | (reporting) | new customer |
| `SalesOrderConfirmed` | CRM | FMS, MMS | AR invoice; stock reserve/issue |
| `InvoiceGenerated` | FMS | (reporting) | AR/AP invoice created |
| `PaymentRecorded` | FMS | (reporting) | payment settled |
| `JournalPosted` | FMS | (reporting) | GL entry posted |

Per-module contracts (payload fields, routing keys) live in
[`shared-contracts/events/`](../../shared-contracts/events/); example payloads in
[`shared-contracts/examples/`](../../shared-contracts/examples/).

## RabbitMQ topology (recommended)
One topic exchange per producer (e.g. `prms.events`), routing key = the event type. Each consumer
binds its own durable queue (e.g. `fms.prms-order-approved`) so consumers scale independently and a
slow consumer never blocks the producer. Centralized exchange/queue config is a shared file — change
it only via review.
