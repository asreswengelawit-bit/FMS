# MMS — Material Management System Blueprint

> **Owner:** Team 3 · **Service:** `services/mms-service` · **Schema:** `mms_schema` · **API:** `/api/v1`
> Read the root [README](../../../README.md) and
> [erp-master-architecture.md](../erp-master-architecture.md) first.

## 1. Scope (master doc §8.3)
**MMS owns:** item master data, warehouse records, stock balances, stock movements, goods receipt,
goods issue, inventory adjustments, reorder tracking.
**Must NOT own:** purchase approval workflow, finance journal ownership, employee attendance,
customer invoicing.
**May integrate with:** PRMS (approved POs / receiving), CRM (sales-related stock movement),
FMS (inventory valuation / accounting impact).

## 2. Domain Model
| Entity | Key fields |
|--------|-----------|
| **Item** | `itemCode` (unique), name, description, `unitOfMeasure`, category, `reorderLevel`, `standardCost`, active |
| **Warehouse** | `code` (unique), name, location, capacity, active |
| **StockMovement** | `itemId`, `warehouseId`, `type` (RECEIPT/ISSUE/TRANSFER/ADJUST), quantity, reference, `occurredAt` |
| **StockBalance** | `itemId`, `warehouseId`, `quantityOnHand` (maintained from movements) |
| **GoodsReceipt** (+ **Line**) | `purchaseOrderId` (PRMS ref), `supplierId`, `warehouseId`, `receiptDate`, lines[] |

Audit fields on all tables: `created_at`, `created_by`, `updated_at`, `updated_by`.

## 3. Package Layout (feature-first, mirrors HRM `department` reference)
```
com.company.mms.<subdomain>/  ← item · warehouse · stockmovement · goodsreceipt
  controller/ dto/ entity/ repository/ service/ mapper/ event/
com.company.mms.shared/
```

## 4. REST API (`/api/v1`, → `docs/architecture/api/mms-openapi.yaml`)
| Method | Path | Permission |
|--------|------|-----------|
| GET/POST | `/api/v1/items` | `mms.item.read` / `.create` |
| GET/PUT/DELETE | `/api/v1/items/{id}` | `mms.item.read` / `.update` |
| GET/POST | `/api/v1/warehouses` | `mms.warehouse.read` / `.create` |
| GET | `/api/v1/stock-balances?itemId=&warehouseId=` | `mms.stock.read` |
| GET/POST | `/api/v1/stock-movements` | `mms.stock.read` / `mms.stock.adjust` |
| GET/POST | `/api/v1/goods-receipts` | `mms.goods_receipt.read` / `.create` |

## 5. Database (Flyway → `mms-service/.../db/migration/`, schema `mms_schema`)
Tables: `item`, `warehouse`, `stock_movement`, `stock_balance`, `goods_receipt`, `goods_receipt_line`.
`V1__init_mms_schema.sql`, `V2__create_items.sql`, … Stock balance updated transactionally per movement.

## 6. Events (`shared-contracts/events/mms-events.md`)
**Publishes:** `StockReceived` (example: `shared-contracts/examples/stock-received.json`),
`InventoryAdjusted`, `GoodsIssued`.
**Consumes:** `PurchaseOrderApproved` (from PRMS) → prepare expected goods receipt.
Payload envelope: `eventId`, `eventType`, `occurredAt`, `source: "mms-service"`, `data`.

## 7. Frontend (`features/mms/`, routes `app/(dashboard)/mms/`)
Pages: `items`, `warehouses`, `stock-movements`, `goods-receipts`. api → hooks → schemas →
components → page. Nav in `features/shared/config/navigation/mms-nav.ts`. Reuse `features/shared/`.

## 8. Integration
**← PRMS:** consumes `PurchaseOrderApproved` to enable receiving; **→ PRMS/FMS:** `StockReceived`
lets PRMS close the PO and FMS post inventory/payable. Events / `/api/v1` REST only.

## 9. Task Backlog
1. Item master CRUD.
2. Warehouse CRUD.
3. Stock movement ledger + on-hand balance projection.
4. Goods receipt posting (consumes `PurchaseOrderApproved`, emits `StockReceived`).
5. Reorder-level low-stock tracking + `InventoryAdjusted`.
