# Inventory Backend

This package manages material balances inside MMS warehouses. It supports stock adjustments, reservations, releases, balance queries, low-stock filtering, and an immutable movement history.

The API base URL is:

```text
http://localhost:8081/api/v1/inventory
```

## Inventory concepts

Each inventory row represents one material in one warehouse. The database prevents duplicate rows for the same material and warehouse combination.

```text
available = onHand - reserved
inventoryValue = onHand * material.unitCost
```

- `onHand` is the physical quantity stored in the warehouse.
- `reserved` is stock promised to a requisition or another business process.
- `available` is stock that can still be reserved or issued.
- A positive adjustment adds physical stock.
- A negative adjustment removes physical stock.
- Reserving does not change physical stock; it increases `reserved`.
- Releasing does not change physical stock; it decreases `reserved`.

The backend never permits these invalid states:

```text
onHand < 0
reserved < 0
reserved > onHand
warehouse used capacity > warehouse capacity
```

## How a write request works

```text
Postman / frontend
       |
       | JSON + Keycloak bearer token
       v
InventoryController
       |
       | authorization and request validation
       v
InventoryService (one database transaction)
       |
       +--> validate active material and warehouse
       +--> lock balance / warehouse rows
       +--> check capacity or available quantity
       +--> update inventory balance
       +--> insert stock movement audit record
       v
PostgreSQL
```

The balance update and movement insert use the same transaction. If either operation fails, both operations roll back.

## Package files

| File | Responsibility |
| --- | --- |
| `Inventory.java` | Maps balances to the `inventory` table and provides balance calculations. |
| `InventoryController.java` | Defines secured HTTP endpoints. |
| `InventoryService.java` | Implements adjustment, reserve, release, filtering, and business rules. |
| `InventoryRepository.java` | Queries and locks inventory rows using Spring Data JPA. |
| `MaterialReference.java` | Read-only view of material data needed for inventory calculations. |
| `MaterialReferenceRepository.java` | Resolves a material by ID or name. |
| `dto/AdjustInventoryRequest.java` | Validates signed stock adjustments. |
| `dto/InventoryQuantityRequest.java` | Validates positive reserve and release quantities. |
| `dto/InventoryResponse.java` | Returns the calculated inventory balance. |
| `dto/InventoryOperationResponse.java` | Returns both the updated balance and audit movement. |
| `../stockmovement/StockMovement.java` | Maps the immutable audit record to `stock_movements`. |
| `../stockmovement/StockMovementRepository.java` | Stores and filters movement history. |

## Concurrency protection

Inventory writes use two protections:

1. Pessimistic row locks serialize changes to the same warehouse/balance during a transaction.
2. The JPA `@Version` field detects conflicting updates and returns `409 Conflict` instead of silently overwriting data.

This prevents two simultaneous requests from reserving the same available quantity or exceeding warehouse capacity.

## Endpoints and roles

| Method | URL | Purpose | Roles |
| --- | --- | --- | --- |
| `GET` | `/api/v1/inventory` | List balances | All MMS roles |
| `GET` | `/api/v1/inventory/{warehouseId}/{materialId}` | Get one balance | All MMS roles |
| `GET` | `/api/v1/inventory/movements` | List audit movements | All MMS roles |
| `POST` | `/api/v1/inventory/adjust` | Add or remove physical stock | `admin`, `inventory_manager`, `store_keeper` |
| `POST` | `/api/v1/inventory/reserve` | Reserve available stock | `admin`, `inventory_manager`, `store_keeper` |
| `POST` | `/api/v1/inventory/release` | Release reserved stock | `admin`, `inventory_manager`, `store_keeper` |

Read roles are `admin`, `mms_user`, `inventory_manager`, `store_keeper`, and `viewer`.

## Query filters

Balance filters can be combined:

```text
GET /api/v1/inventory?warehouseId=WH-INVENTORY
GET /api/v1/inventory?materialId=MAT-001
GET /api/v1/inventory?lowStock=true
GET /api/v1/inventory?warehouseId=WH-INVENTORY&lowStock=true
```

Movement filters can also be combined:

```text
GET /api/v1/inventory/movements?warehouseId=WH-INVENTORY
GET /api/v1/inventory/movements?materialId=MAT-001
GET /api/v1/inventory/movements?type=ADJ
GET /api/v1/inventory/movements?type=RESERVE
GET /api/v1/inventory/movements?type=RELEASE
```

## Request fields

### Adjustment

| Field | Required | Rule |
| --- | --- | --- |
| `materialId` | Yes | Existing active material ID or exact material name. |
| `warehouseId` | Yes | Existing active warehouse ID. |
| `quantity` | Yes | Signed number; positive adds and negative removes. It cannot be zero. |
| `referenceNumber` | Yes | Business reference, at most 100 characters. |
| `notes` | No | At most 500 characters. |
| `movementDate` | No | ISO date; defaults to the current date. |

### Reserve and release

Reserve and release use the same fields, but `quantity` must always be greater than zero.

For compatibility with the current frontend, the backend also accepts these aliases:

| Canonical field | Frontend alias |
| --- | --- |
| `materialId` | `item` |
| `warehouseId` | `warehouse` |
| `quantity` | `qty` |
| `referenceNumber` | `ref` |
| `notes` | `note` |
| `movementDate` | `date` |

## Stock status

Status is calculated from `available`, not only `onHand`:

| Condition | Status |
| --- | --- |
| `available <= 0` | `Out of Stock` |
| `available <= reorderLevel` | `Low Stock` |
| `available > reorderLevel` | `Normal` |

## Postman test guide

### 1. Start infrastructure

```bash
cd /home/yotor/Documents/DT/Projects/MMS/ERP-INSA
sudo docker compose up -d mms-db keycloak-db keycloak
sudo docker compose ps
```

Wait until all three containers report `healthy`.

### 2. Start or restart the backend

Stop an older backend with `Ctrl+C`, then run:

```bash
cd /home/yotor/Documents/DT/Projects/MMS/ERP-INSA/services/mms-service
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run
```

Verify it in another terminal:

```bash
curl http://localhost:8081/actuator/health
```

Expected status is `UP`.

### 3. Configure Postman authentication

You can reuse the `MMS Local` environment and `MMS Warehouse` OAuth token described in [the warehouse guide](../warehouse/README.md).

If starting from a new Postman collection, configure collection authorization as follows:

| Setting | Value |
| --- | --- |
| Type | `OAuth 2.0` |
| Grant Type | `Authorization Code (With PKCE)` |
| Callback URL | `https://oauth.pstmn.io/v1/callback` |
| Auth URL | `http://localhost:8080/realms/erp/protocol/openid-connect/auth` |
| Access Token URL | `http://localhost:8080/realms/erp/protocol/openid-connect/token` |
| Client ID | `mms-postman` |
| Client Secret | Leave empty |
| Code Challenge Method | `SHA-256` |
| Scope | `openid profile email` |

Select **Get New Access Token**, sign in as `erp-admin`, select **Use Token**, and make every request inherit authorization from the collection.

Create a Postman environment variable:

```text
baseUrl = http://localhost:8081
```

### 4. Create a test warehouse

Inventory requires an existing warehouse. Send:

```text
POST {{baseUrl}}/api/v1/warehouses
```

```json
{
  "id": "WH-INVENTORY",
  "name": "Inventory Test Warehouse",
  "location": "Addis Ababa",
  "type": "General",
  "capacity": 10000,
  "manager": "Inventory Manager",
  "active": true
}
```

Expected status: `201 Created`. If it already exists, `409 Conflict` is safe to ignore for this test.

### 5. Create a test material

Inventory also requires an existing material. Until the Material CRUD API is implemented, insert one test material directly:

```bash
cd /home/yotor/Documents/DT/Projects/MMS/ERP-INSA
sudo docker compose exec mms-db \
  psql -U mms -d mms \
  -c "INSERT INTO materials (id, name, category, unit_of_measure, unit_cost, reorder_level, active) VALUES ('MAT-POSTMAN', 'Postman Test Material', 'Testing', 'Pcs', 25, 20, TRUE) ON CONFLICT (id) DO UPDATE SET active = TRUE;"
```

### 6. Add initial stock

Create `Add Inventory` in Postman:

```text
POST {{baseUrl}}/api/v1/inventory/adjust
```

Body:

```json
{
  "materialId": "MAT-POSTMAN",
  "warehouseId": "WH-INVENTORY",
  "quantity": 100,
  "referenceNumber": "OPENING-001",
  "notes": "Opening inventory balance",
  "movementDate": "2026-07-30"
}
```

Expected status: `200 OK`. The response contains two objects:

```json
{
  "inventory": {
    "materialId": "MAT-POSTMAN",
    "warehouseId": "WH-INVENTORY",
    "onHand": 100.00,
    "reserved": 0.00,
    "available": 100.00,
    "inventoryValue": 2500.0000,
    "status": "Normal"
  },
  "movement": {
    "type": "ADJ",
    "quantity": 100.00,
    "referenceNumber": "OPENING-001",
    "processedBy": "erp-admin"
  }
}
```

The response also contains IDs, material/warehouse names, version, timestamps, and frontend-compatible movement aliases.

### 7. List inventory balances

```text
GET {{baseUrl}}/api/v1/inventory
```

Expected status: `200 OK`. Find the `MAT-POSTMAN` and `WH-INVENTORY` balance in the array.

Test one balance:

```text
GET {{baseUrl}}/api/v1/inventory/WH-INVENTORY/MAT-POSTMAN
```

### 8. Reserve stock

```text
POST {{baseUrl}}/api/v1/inventory/reserve
```

```json
{
  "materialId": "MAT-POSTMAN",
  "warehouseId": "WH-INVENTORY",
  "quantity": 30,
  "referenceNumber": "REQ-POSTMAN-001",
  "notes": "Reserved for Postman test"
}
```

Expected balance:

```text
onHand   = 100
reserved = 30
available = 70
```

### 9. Release reserved stock

```text
POST {{baseUrl}}/api/v1/inventory/release
```

```json
{
  "materialId": "MAT-POSTMAN",
  "warehouseId": "WH-INVENTORY",
  "quantity": 10,
  "referenceNumber": "REQ-POSTMAN-001-CANCEL",
  "notes": "Released unused reservation"
}
```

Expected balance:

```text
onHand   = 100
reserved = 20
available = 80
```

### 10. Remove physical stock

Use the adjustment endpoint with a negative quantity:

```text
POST {{baseUrl}}/api/v1/inventory/adjust
```

```json
{
  "materialId": "MAT-POSTMAN",
  "warehouseId": "WH-INVENTORY",
  "quantity": -25,
  "referenceNumber": "ISSUE-POSTMAN-001",
  "notes": "Manual stock issue"
}
```

Expected balance:

```text
onHand   = 75
reserved = 20
available = 55
```

### 11. View the audit ledger

```text
GET {{baseUrl}}/api/v1/inventory/movements?materialId=MAT-POSTMAN&warehouseId=WH-INVENTORY
```

Expected movement types are `ADJ`, `RESERVE`, `RELEASE`, and `ADJ`, ordered newest first.

The backend gets `processedBy` from the Keycloak token. The client cannot impersonate another user by sending a `by` field.

### 12. Test safety rules

Try reserving more than the current available stock:

```json
{
  "materialId": "MAT-POSTMAN",
  "warehouseId": "WH-INVENTORY",
  "quantity": 1000,
  "referenceNumber": "REQ-TOO-LARGE"
}
```

Expected status: `409 Conflict` with `Insufficient available stock`.

Try a zero adjustment. Expected status: `400 Bad Request`.

Try adding enough stock to exceed warehouse capacity. Expected status: `409 Conflict`.

Try removing stock until `onHand` would be below `reserved`. Expected status: `409 Conflict`.

### 13. Verify PostgreSQL

Check the balance:

```bash
sudo docker compose exec mms-db \
  psql -U mms -d mms \
  -c "SELECT material_id, warehouse_id, on_hand, reserved, on_hand - reserved AS available, version, updated_at FROM inventory WHERE material_id = 'MAT-POSTMAN';"
```

Check the movement history:

```bash
sudo docker compose exec mms-db \
  psql -U mms -d mms \
  -c "SELECT movement_type, quantity, reference_number, processed_by, movement_date FROM stock_movements WHERE material_id = 'MAT-POSTMAN' ORDER BY created_at;"
```

## HTTP errors

| Status | Meaning |
| --- | --- |
| `400 Bad Request` | Invalid JSON, missing fields, zero adjustment, or invalid quantity. |
| `401 Unauthorized` | Missing, expired, or invalid Keycloak access token. |
| `403 Forbidden` | Valid token without the required MMS role. |
| `404 Not Found` | Material, warehouse, or balance does not exist. |
| `409 Conflict` | Insufficient stock, excessive reservation/release, capacity overflow, inactive master data, or concurrent update. |

## Run automated tests

Run the inventory integration tests:

```bash
cd /home/yotor/Documents/DT/Projects/MMS/ERP-INSA/services/mms-service
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn -Dtest=InventoryServiceTests test
```

Run every MMS backend test:

```bash
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn test
```

The inventory tests cover adding stock, audit movements, reservation, release, capacity limits, reserved-stock protection, inventory value, and low-stock calculation.
