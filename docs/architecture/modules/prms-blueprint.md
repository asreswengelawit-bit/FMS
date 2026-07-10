# PRMS — Procurement & Resource Management Blueprint

> **Owner:** Team 2 · **Service:** `services/prms-service` · **Schema:** `prms_schema` · **API:** `/api/v1`
> Read the root [README](../../../README.md) and
> [erp-master-architecture.md](../erp-master-architecture.md) first.

## 1. Scope (master doc §8.2)
**PRMS owns:** suppliers, purchase requests, purchase approvals, purchase orders, procurement
workflows, procurement status tracking.
**Must NOT own:** stock balances, journal posting, employee records, customer sales records.
**May integrate with:** MMS (goods receiving / inventory-linked procurement), FMS (supplier payable).

## 2. Domain Model
| Entity | Key fields |
|--------|-----------|
| **Supplier** | `code` (unique), name, contact, `paymentTerms`, rating, status |
| **PurchaseRequest** | `prNumber`, `requesterId`, lines[], status (DRAFT/SUBMITTED/APPROVED/REJECTED), justification |
| **PurchaseRequestLine** | `prId`, itemRef, qty, estimatedPrice |
| **PurchaseOrder** | `poNumber`, `supplierId`, `prId`, lines[], status (DRAFT/APPROVED/SENT/RECEIVED/CLOSED), total |
| **PurchaseOrderLine** | `poId`, itemRef, qty, unitPrice |
| **Approval** | `entityType`, `entityId`, `approverId`, decision, level |

Audit fields on all tables: `created_at`, `created_by`, `updated_at`, `updated_by`.

## 3. Package Layout (feature-first, mirrors HRM `department` reference)
```
com.company.prms.<subdomain>/  ← supplier · purchaserequest · purchaseorder · approval
  controller/ dto/ entity/ repository/ service/ mapper/ event/
com.company.prms.shared/
```

## 4. REST API (`/api/v1`, → `docs/architecture/api/prms-openapi.yaml`)
| Method | Path | Permission |
|--------|------|-----------|
| GET/POST | `/api/v1/suppliers` | `prms.supplier.read` / `.create` |
| GET/PUT/DELETE | `/api/v1/suppliers/{id}` | `prms.supplier.read` / `.update` |
| GET/POST | `/api/v1/purchase-requests` | `prms.purchase_request.read` / `.create` |
| POST | `/api/v1/purchase-requests/{id}/submit` | `prms.purchase_request.submit` |
| GET/POST | `/api/v1/purchase-orders` | `prms.purchase_order.read` / `.create` |
| POST | `/api/v1/purchase-orders/{id}/approve` | `prms.purchase_order.approve` |

## 5. Database (Flyway → `prms-service/.../db/migration/`, schema `prms_schema`)
Tables: `supplier`, `purchase_request`, `purchase_request_line`, `purchase_order`,
`purchase_order_line`, `approval`. `V1__init_prms_schema.sql`, `V2__create_suppliers.sql`, …

## 6. Events (`shared-contracts/events/prms-events.md`)
**Publishes:** `PurchaseRequestCreated`, `PurchaseOrderApproved`
(example: `shared-contracts/examples/purchase-order-approved.json`).
**Consumes:** `StockReceived` (from MMS) → move PO to RECEIVED/CLOSED.
Payload envelope: `eventId`, `eventType`, `occurredAt`, `source: "prms-service"`, `data`.

## 7. Frontend (`features/prms/`, routes `app/(dashboard)/prms/`)
Pages: `suppliers`, `purchase-requests`, `purchase-orders`. api → hooks → schemas → components → page.
Nav in `features/shared/config/navigation/prms-nav.ts`. Reuse `features/shared/`.

## 8. Integration
**→ MMS:** `PurchaseOrderApproved` enables receiving; **← MMS:** `StockReceived` closes the PO.
**→ FMS:** `PurchaseOrderApproved` signals an upcoming payable. Events / `/api/v1` REST only.

## 9. Task Backlog
1. Supplier CRUD.
2. Purchase request with line items + submit (`PurchaseRequestCreated`).
3. Purchase order from PR.
4. Approval workflow + `PurchaseOrderApproved`.
5. Consume `StockReceived` to close the PO.
