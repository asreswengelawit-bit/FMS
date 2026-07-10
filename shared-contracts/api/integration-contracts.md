# Integration Contracts

Cross-service flows and who is responsible for each hop. All integration is **REST (`/api/v1/...`)** or
**RabbitMQ events** — never direct database access. Boundaries: [service-boundaries](../../docs/architecture/service-boundaries.md).
Events: [event-contracts](../../docs/architecture/event-contracts.md).

## Flow 1 — Procure to Stock to Pay
```
PRMS: approve PO ──PurchaseOrderApproved──▶ MMS: create expected goods receipt
                                       └──▶ FMS: record expected payable
MMS: post goods receipt ──StockReceived──▶ PRMS: close/partially-close PO
                                       └──▶ FMS: AP accrual / inventory valuation
```

## Flow 2 — Order to Cash
```
CRM: confirm sales order ──SalesOrderConfirmed──▶ FMS: create AR invoice ──InvoiceGenerated──▶ (reporting)
                                             └──▶ MMS: reserve/issue stock ──GoodsIssued──▶ FMS
FMS: record payment ──PaymentRecorded──▶ (reporting / AR ageing)
```

## Flow 3 — Payroll to Ledger
```
HRM: process payroll ──PayrollProcessed──▶ FMS: post salary-expense journal ──JournalPosted──▶ (reporting)
```

## Synchronous REST lookups (when immediate data is needed)
| Caller | Endpoint (owner) | Why |
|--------|------------------|-----|
| PRMS | `GET /api/v1/items/{id}` (MMS) | validate item on a purchase line |
| MMS | `GET /api/v1/purchase-orders/{id}` (PRMS) | validate PO before receiving |
| FMS | `GET /api/v1/employees?ids=` (HRM) | enrich payroll journal narration |
| CRM | `GET /api/v1/stock-balances?itemId=` (MMS) | show availability on a quote |

Prefer **events** for state changes and **REST** only for immediate reads. Keep synchronous chains
short to avoid coupling and cascading failures.

## Contract change protocol
Producer owns the contract; consumers review. Additive changes → normal PR. Breaking changes → a
`contract/*` PR, sign-off from every consumer, and a deprecation window where old + new coexist.
