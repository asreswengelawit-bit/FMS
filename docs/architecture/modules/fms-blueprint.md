# FMS — Finance Management System Blueprint

> **Owner:** Team 5 · **Service:** `services/fms-service` · **Schema:** `fms_schema` · **API:** `/api/v1`
> Read the root [README](../../../README.md) and
> [erp-master-architecture.md](../erp-master-architecture.md) first.
> FMS is the **most integration-heavy** service — finance reacts to events from every other module.

## 1. Scope (master doc §8.5)
**FMS owns:** chart of accounts, journals, accounts payable, accounts receivable, invoices, payments,
budgeting, financial reports, posting and accounting rules.
**Must NOT own:** employee attendance details, supplier procurement workflow, stock receiving logic,
customer lead management.
**May consume events from:** HRM, PRMS, MMS, CRM.

## 2. Domain Model
| Entity | Key fields |
|--------|-----------|
| **ChartOfAccount** | `accountCode` (unique), name, type (ASSET/LIABILITY/EQUITY/REVENUE/EXPENSE), `parentId` |
| **Journal** (+ **Line**) | `entryNumber`, date, status (DRAFT/POSTED), lines[] (`accountId`, debit, credit) |
| **Invoice** | `invoiceNumber`, `type` (AR/AP), partyRef, amount, `dueDate`, status |
| **Payment** | `paymentNumber`, `invoiceId`, amount, method, date |
| **Receivable / Payable** | invoiceRef, outstanding, ageing |
| **Budget** | period, `accountId`, amount |

Audit fields on all tables: `created_at`, `created_by`, `updated_at`, `updated_by`.

## 3. Package Layout (feature-first, mirrors HRM `department` reference)
```
com.company.fms.<subdomain>/  ← chartofaccount · journal · invoice · payment · receivable · payable · budget
  controller/ dto/ entity/ repository/ service/ mapper/ event/
com.company.fms.shared/
```

## 4. REST API (`/api/v1`, → `docs/architecture/api/fms-openapi.yaml`)
| Method | Path | Permission |
|--------|------|-----------|
| GET/POST | `/api/v1/chart-of-accounts` | `fms.account.read` / `.create` |
| GET/POST | `/api/v1/journals` | `fms.journal.read` / `.create` |
| POST | `/api/v1/journals/{id}/post` | `fms.journal.post` |
| GET/POST | `/api/v1/invoices` | `fms.invoice.read` / `.create` |
| GET/POST | `/api/v1/payments` | `fms.payment.read` / `.record` |
| GET | `/api/v1/reports/*` | `fms.report.read` |

## 5. Database (Flyway → `fms-service/.../db/migration/`, schema `fms_schema`)
Tables: `chart_of_account`, `journal`, `journal_line`, `invoice`, `payment`, `receivable`, `payable`,
`budget`. `V1__init_fms_schema.sql`, `V2__create_chart_of_accounts.sql`, …
Balanced-journal rule (Σdebit = Σcredit) enforced in the service layer before posting.

## 6. Events (`shared-contracts/events/fms-events.md`)
**Publishes:** `InvoiceGenerated` (example: `shared-contracts/examples/invoice-generated.json`),
`PaymentRecorded`, `JournalPosted`.
**Consumes:** `SalesOrderConfirmed` (CRM) → AR invoice; `PurchaseOrderApproved` (PRMS) +
`StockReceived` (MMS) → AP invoice/accrual; `PayrollProcessed` (HRM) → expense journal.
Payload envelope: `eventId`, `eventType`, `occurredAt`, `source: "fms-service"`, `data`.

## 7. Frontend (`features/fms/`, routes `app/(dashboard)/fms/`)
Pages: `chart-of-accounts`, `journals`, `invoices`, `payments`, `reports`. api → hooks → schemas →
components → page. Nav in `features/shared/config/navigation/fms-nav.ts`. Reuse `features/shared/`.

## 8. Integration
FMS is the biggest **consumer**: it listens to CRM, PRMS, MMS, HRM events and posts entries, and
exposes read-only reports. It never reads another service's DB — only their events / `/api/v1` REST.

## 9. Task Backlog
1. Chart of accounts CRUD (tree).
2. Manual journal entry + balanced-post rule (`JournalPosted`).
3. `SalesOrderConfirmed` → AR invoice consumer emitting `InvoiceGenerated`.
4. Payment recording + `PaymentRecorded`.
5. Trial balance & AR/AP ageing reports.
