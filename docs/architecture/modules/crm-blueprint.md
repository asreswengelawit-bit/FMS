# CRM — Sales & Customer Relationship Management Blueprint

> **Owner:** Team 4 · **Service:** `services/crm-service` · **Schema:** `crm_schema` · **API:** `/api/v1`
> Read the root [README](../../../README.md) and
> [erp-master-architecture.md](../erp-master-architecture.md) first.

## 1. Scope (master doc §8.4)
**CRM owns:** customers, leads, opportunities, quotations, sales orders, customer communications /
status tracking.
**Must NOT own:** stock ledger, journal ownership, payroll, supplier procurement workflow.
**May integrate with:** MMS (inventory availability / stock issue), FMS (invoices, receivables,
payment status).

## 2. Domain Model
| Entity | Key fields |
|--------|-----------|
| **Customer** | `code` (unique), name, type, email, phone, address, `creditLimit`, status |
| **Lead** | name, company, source, status (NEW/QUALIFIED/WON/LOST), `estimatedValue`, `ownerId` |
| **Quotation** (+ **Line**) | `quoteNumber`, `customerId`, lines[], `validUntil`, status, total |
| **SalesOrder** (+ **Line**) | `orderNumber`, `customerId`, `quotationId`, lines[], status (DRAFT/CONFIRMED/CLOSED), total |

Audit fields on all tables: `created_at`, `created_by`, `updated_at`, `updated_by`.

## 3. Package Layout (feature-first, mirrors HRM `department` reference)
```
com.company.crm.<subdomain>/  ← customer · lead · quotation · salesorder
  controller/ dto/ entity/ repository/ service/ mapper/ event/
com.company.crm.shared/
```

## 4. REST API (`/api/v1`, → `docs/architecture/api/crm-openapi.yaml`)
| Method | Path | Permission |
|--------|------|-----------|
| GET/POST | `/api/v1/customers` | `crm.customer.read` / `.create` |
| GET/PUT/DELETE | `/api/v1/customers/{id}` | `crm.customer.read` / `.update` |
| GET/POST | `/api/v1/leads` | `crm.lead.read` / `.create` |
| POST | `/api/v1/leads/{id}/convert` | `crm.lead.convert` |
| GET/POST | `/api/v1/quotations` | `crm.quotation.read` / `.create` |
| GET/POST | `/api/v1/sales-orders` | `crm.sales_order.read` / `.create` |
| POST | `/api/v1/sales-orders/{id}/confirm` | `crm.sales_order.confirm` |

## 5. Database (Flyway → `crm-service/.../db/migration/`, schema `crm_schema`)
Tables: `customer`, `lead`, `quotation`, `quotation_line`, `sales_order`, `sales_order_line`.
`V1__init_crm_schema.sql`, `V2__create_customers.sql`, …

## 6. Events (`shared-contracts/events/crm-events.md`)
**Publishes:** `CustomerCreated`, `SalesOrderConfirmed`.
**Consumes:** *(optional)* `InventoryAdjusted` / stock availability from MMS for display.
Payload envelope: `eventId`, `eventType`, `occurredAt`, `source: "crm-service"`, `data`.

## 7. Frontend (`features/crm/`, routes `app/(dashboard)/crm/`)
Pages: `customers`, `leads`, `quotations`, `sales-orders`. api → hooks → schemas → components → page.
Nav in `features/shared/config/navigation/crm-nav.ts`. Reuse `features/shared/`.

## 8. Integration
**→ FMS:** `SalesOrderConfirmed` triggers an AR invoice / receivable.
**→ MMS:** `SalesOrderConfirmed` can trigger stock reservation / issue. Events / `/api/v1` REST only.

## 9. Task Backlog
1. Customer CRUD (`CustomerCreated`).
2. Lead pipeline with status transitions + convert.
3. Quotation with line items + totals.
4. Sales order from quotation + confirm (`SalesOrderConfirmed`).
