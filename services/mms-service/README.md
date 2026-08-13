# MMS Service

## Java version

This service requires **Java 21**. If your shell defaults to an older JDK, select Java 21 before building:

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
mvn test
```

Confirm with `java -version`; it must report version 21. The service Dockerfile also builds with Eclipse Temurin 21.

Spring Boot backend for the INSA ERP Material Management System.

## Technology

- Java 21
- Spring Boot 4.0.7
- Maven 3.9+
- PostgreSQL 16
- Flyway
- Spring Security OAuth2 Resource Server (Keycloak JWT)

## Local startup

From the repository root:

```bash
cp .env.example .env
docker compose up -d mms-db keycloak-db keycloak
```

Then run the service:

```bash
cd services/mms-service
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn spring-boot:run
```

Health endpoint:

```bash
curl http://localhost:8081/actuator/health
```

The first Maven run downloads dependencies. The service uses port `8081` and expects Keycloak on port `8080`.

## Warehouse API

Base URL: `http://localhost:8081/api/v1/warehouses`

See [the warehouse module guide](src/main/java/com/company/mms/warehouse/README.md) for the request flow, file responsibilities, permissions, validation rules, and a complete Postman walkthrough.

| Method | Path | Purpose | Roles |
| --- | --- | --- | --- |
| `GET` | `/api/v1/warehouses` | List warehouses | MMS roles |
| `GET` | `/api/v1/warehouses/{id}` | Get one warehouse | MMS roles |
| `POST` | `/api/v1/warehouses` | Create a warehouse | admin, inventory_manager, store_keeper |
| `PUT` | `/api/v1/warehouses/{id}` | Update a warehouse | admin, inventory_manager, store_keeper |
| `DELETE` | `/api/v1/warehouses/{id}` | Delete an unused warehouse | admin, inventory_manager |

All requests require an OAuth2 bearer token issued by the `erp` Keycloak realm. An example create body is:

```json
{
  "id": "WH-Main",
  "name": "Main Warehouse",
  "location": "Addis Ababa HQ",
  "type": "General",
  "capacity": 5000,
  "manager": "Dawit Alemu",
  "active": true
}
```

Use `GET /api/v1/warehouses?active=true` to return only active warehouses. Error responses include an HTTP status, message, request path, and field-level validation errors.

For local Postman testing, use the `mms-postman` public client with OAuth2 Authorization Code and PKCE. Its callback URL is `https://oauth.pstmn.io/v1/callback`; the authorization and token URLs are under `http://localhost:8080/realms/erp/protocol/openid-connect/`.

## Inventory API

Base URL: `http://localhost:8081/api/v1/inventory`

The inventory API lists balances and movements and supports transactional stock adjustments, reservations, and releases. See [the inventory module guide](src/main/java/com/company/mms/inventory/README.md) for balance rules, concurrency protection, endpoint details, and the complete Postman walkthrough.

## Security roles

Keycloak realm roles are converted to Spring authorities with the `ROLE_` prefix. MMS endpoints should use:

- `inventory_manager`: full control and approvals
- `store_keeper`: operational create/update/receive access
- `viewer`: read-only access
- `mms_user`: base module access

## Package ownership

- `item`: material master data
- `inventory`: balances, reservations, and adjustments
- `warehouse`: warehouses, zones, locations, and bins
- `stockmovement`: movement ledger
- `goodsreceipt`: receipt workflow
- `requisition`: internal requests and issues
- `security`: JWT and authorization configuration
- `shared`: shared response and exception types

The legacy Supplier project remains in its original nested location and is excluded from this Maven build. It should be moved to `services/supplier-service` in a separate, reviewed change.
