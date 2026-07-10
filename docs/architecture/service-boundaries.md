# Service Boundaries

Defines what each service **owns**, must **not own**, and **may integrate with**. This is the most
important guard against broken ownership and duplicated logic. Integration is always via REST
(`/api/v1/...`) or RabbitMQ events — never direct database access.

## HRM Service (Team 1)
- **Owns:** employee master data, departments, positions/job titles, attendance, leave requests, organizational structure, employee status, payroll-related HR source data.
- **Must not own:** accounting journals, purchase orders, stock balances, customer records.
- **Integrates with:** FMS (payroll / salary expense posting), shared auth (user-role mapping).

## PRMS Service (Team 2)
- **Owns:** suppliers, purchase requests, purchase approvals, purchase orders, procurement workflows, procurement status tracking.
- **Must not own:** stock balances, journal posting, employee records, customer sales records.
- **Integrates with:** MMS (goods receiving / inventory-linked procurement), FMS (supplier payable).

## MMS Service (Team 3)
- **Owns:** item master data, warehouse records, stock balances, stock movements, goods receipt, goods issue, inventory adjustments, reorder tracking.
- **Must not own:** purchase approval workflow, finance journal ownership, employee attendance, customer invoicing.
- **Integrates with:** PRMS (approved POs / receiving), CRM (sales-related stock movement), FMS (inventory valuation / accounting).

## CRM Service (Team 4)
- **Owns:** customers, leads, opportunities, quotations, sales orders, customer communications / status tracking.
- **Must not own:** stock ledger, journal ownership, payroll, supplier procurement workflow.
- **Integrates with:** MMS (inventory availability / stock issue), FMS (invoices, receivables, payment status).

## FMS Service (Team 5)
- **Owns:** chart of accounts, journals, accounts payable, accounts receivable, invoices, payments, budgeting, financial reports, posting & accounting rules.
- **Must not own:** employee attendance details, supplier procurement workflow, stock receiving logic, customer lead management.
- **Consumes events from:** HRM, PRMS, MMS, CRM. FMS is the most integration-heavy service — finance depends on business events from every other module.

## Ownership matrix (who produces → who reacts)
| Business event | Producer | Reacting consumers |
|----------------|----------|--------------------|
| `PayrollProcessed` | HRM | FMS (expense journal) |
| `PurchaseOrderApproved` | PRMS | MMS (prepare receipt), FMS (payable) |
| `StockReceived` | MMS | PRMS (close PO), FMS (inventory/payable) |
| `SalesOrderConfirmed` | CRM | FMS (AR invoice), MMS (stock reserve/issue) |
| `InvoiceGenerated` / `PaymentRecorded` | FMS | (reporting / status) |

See [event-contracts.md](event-contracts.md) for payloads and [integration-contracts](../../shared-contracts/api/integration-contracts.md) for flows.
