# FMS Events

**Producer:** `fms-service` · Exchange: `fms.events` (topic). FMS owns these contracts; it is also the
**most integration-heavy consumer**. Envelope per [event-contracts](../../docs/architecture/event-contracts.md).

## Published
### `InvoiceGenerated`
Routing key: `fms.invoice.generated`. Example: [`examples/invoice-generated.json`](../examples/invoice-generated.json).
```json
{ "invoiceId": 300, "invoiceNumber": "INV-0300", "type": "AR", "partyRef": 21, "amount": 90000,
  "currency": "ETB", "dueDate": "2026-08-08", "status": "ISSUED" }
```

### `PaymentRecorded`
Routing key: `fms.payment.recorded`
```json
{ "paymentId": 410, "invoiceId": 300, "amount": 90000, "currency": "ETB", "method": "BANK_TRANSFER" }
```

### `JournalPosted`
Routing key: `fms.journal.posted`
```json
{ "journalId": 700, "entryNumber": "JE-0700", "postedAt": "2026-07-09T10:00:00Z" }
```

## Consumed
| Event | From | Action |
|-------|------|--------|
| `SalesOrderConfirmed` | CRM | create AR invoice / receivable |
| `PurchaseOrderApproved` | PRMS | record expected payable |
| `StockReceived` | MMS | inventory valuation / AP accrual |
| `PayrollProcessed` | HRM | post salary-expense journal |
