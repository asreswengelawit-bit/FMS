# Shared DTOs

Cross-cutting shapes every service and the frontend agree on. These are **conventions**, not shared
code — each service defines its own classes matching these shapes (no shared JAR), and the frontend
mirrors them in zod.

## Success response
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": { "id": 1, "name": "John Doe" },
  "timestamp": "2026-07-08T12:00:00Z"
}
```

## Error response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [ { "field": "email", "message": "Invalid email format" } ],
  "timestamp": "2026-07-08T12:00:00Z"
}
```
- `errors` is present on validation failures (HTTP 400). Other errors (401/403/404/409/500) may carry an empty `errors` and a descriptive `message`.

## Pagination (list endpoints)
Request: `?page=0&size=20&sort=createdAt,desc`. Response `data`:
```json
{ "content": [ ], "page": 0, "size": 20, "totalElements": 137, "totalPages": 7 }
```

## Audit fields (on every business record)
```json
{ "createdAt": "...", "createdBy": "user-id", "updatedAt": "...", "updatedBy": "user-id" }
```

## Money
```json
{ "amount": 150000.0000, "currency": "ETB" }
```
`amount` maps to SQL `NUMERIC(19,4)`. Always pair an amount with its currency.

## Event envelope
See [event-contracts](../../docs/architecture/event-contracts.md):
`{ eventId, eventType, occurredAt, source, data }`.

## IDs
Internal surrogate IDs are `BIGINT`. Cross-module references are stored as plain ID values with no
cross-schema foreign key (e.g. MMS stores `purchaseOrderId` from PRMS).
