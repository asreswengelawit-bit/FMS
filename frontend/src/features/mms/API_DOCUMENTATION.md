# Material Management System (MMS) - API Documentation

## API Documentation Template

This document provides API contract specifications for all MMS services.

---

## Table of Contents

1. [API Standards](#api-standards)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Material Service API](#material-service-api)
5. [Inventory Service API](#inventory-service-api)
6. [Order Service API](#order-service-api)
7. [Warehouse Service API](#warehouse-service-api)
8. [Supplier Service API](#supplier-service-api)
9. [User Service API](#user-service-api)
10. [Rate Limiting](#rate-limiting)
11. [Webhooks](#webhooks)

---

## API Standards

### Base URL
```
Development:  http://localhost:8080/api/v1
Staging:      https://staging-api.mms.com/api/v1
Production:   https://api.mms.com/api/v1
```

### HTTP Methods
- **GET**: Retrieve resource(s)
- **POST**: Create new resource
- **PUT**: Update entire resource
- **PATCH**: Partial update
- **DELETE**: Delete resource

### Headers
```
Content-Type: application/json
Authorization: Bearer {token}
X-Request-ID: {uuid}          # Optional, for tracing
X-Idempotency-Key: {uuid}     # For idempotent requests
```

### Response Status Codes
```
200 OK              - Successful request
201 Created         - Resource created
204 No Content      - Successful deletion
400 Bad Request     - Invalid request
401 Unauthorized    - Authentication failed
403 Forbidden       - Insufficient permissions
404 Not Found       - Resource not found
409 Conflict        - Resource already exists
422 Unprocessable   - Validation error
429 Too Many        - Rate limit exceeded
500 Server Error    - Internal server error
```

---

## Authentication

### JWT Token

**Login Endpoint**:
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john.doe",
  "password": "secure_password"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user-uuid",
      "username": "john.doe",
      "email": "john@example.com",
      "roles": ["INVENTORY_MANAGER"]
    }
  }
}
```

### Token Usage
Include in all authenticated requests:
```
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh
```http
POST /auth/refresh-token
Authorization: Bearer {refreshToken}
```

---

## Error Handling

### Standard Error Response
```json
{
  "status": "ERROR",
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "sku",
      "message": "SKU must be unique"
    },
    {
      "field": "unitCost",
      "message": "Unit cost must be greater than 0"
    }
  ],
  "timestamp": "2026-07-03T10:30:00Z",
  "requestId": "req-uuid-123"
}
```

### Error Codes

| Code | Message | Description |
|------|---------|-------------|
| VALIDATION_ERROR | Validation failed | Input validation error |
| RESOURCE_NOT_FOUND | Resource not found | Entity doesn't exist |
| DUPLICATE_RESOURCE | Resource already exists | Unique constraint violated |
| UNAUTHORIZED | Authentication failed | Invalid credentials |
| FORBIDDEN | Access denied | Insufficient permissions |
| BUSINESS_ERROR | Business rule violated | Domain logic error |
| SERVICE_UNAVAILABLE | Service unavailable | Downstream service error |

---

## Material Service API

**Base Path**: `/materials`

### List Materials

**Endpoint**:
```http
GET /api/v1/materials?page=0&size=20&search=&isActive=true
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (0-indexed) |
| size | integer | No | Page size (default: 20, max: 100) |
| search | string | No | Search term for name/SKU |
| isActive | boolean | No | Filter by active status |
| supplierId | UUID | No | Filter by supplier |

**Response**:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "mat-uuid-001",
      "sku": "MAT-001",
      "name": "Steel Plate A1",
      "description": "High-grade steel plate",
      "unitOfMeasure": "kg",
      "unitCost": 45.50,
      "safetyStock": 100,
      "leadTimeDays": 7,
      "supplier": {
        "id": "sup-001",
        "name": "Acme Supplies"
      },
      "isActive": true,
      "createdAt": "2026-07-01T10:00:00Z",
      "createdBy": "admin@example.com"
    }
  ],
  "pagination": {
    "page": 0,
    "size": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true
  }
}
```

### Get Material

**Endpoint**:
```http
GET /api/v1/materials/{id}
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | UUID | Material ID |

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "mat-uuid-001",
    "sku": "MAT-001",
    "name": "Steel Plate A1",
    "description": "High-grade steel plate",
    "unitOfMeasure": "kg",
    "unitCost": 45.50,
    "safetyStock": 100,
    "leadTimeDays": 7,
    "reorderQuantity": 500,
    "supplier": {
      "id": "sup-001",
      "name": "Acme Supplies",
      "code": "ACM-001"
    },
    "category": {
      "id": "cat-001",
      "name": "Raw Materials"
    },
    "isActive": true,
    "isHazmat": false,
    "createdAt": "2026-07-01T10:00:00Z",
    "createdBy": "admin@example.com",
    "updatedAt": "2026-07-03T14:30:00Z",
    "updatedBy": "manager@example.com"
  }
}
```

### Create Material

**Endpoint**:
```http
POST /api/v1/materials
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "sku": "MAT-002",
  "name": "Aluminum Plate B2",
  "description": "Aluminum alloy plate",
  "unitOfMeasure": "kg",
  "supplierId": "sup-001",
  "categoryId": "cat-001",
  "unitCost": 25.75,
  "safetyStock": 200,
  "leadTimeDays": 5,
  "reorderQuantity": 1000,
  "isHazmat": false
}
```

**Response** (201 Created):
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "mat-uuid-002",
    "sku": "MAT-002",
    "name": "Aluminum Plate B2",
    "createdAt": "2026-07-03T15:00:00Z"
  }
}
```

**Validation Rules**:
- `sku`: Required, unique, 3-50 characters
- `name`: Required, 1-255 characters
- `unitOfMeasure`: Required, valid enum
- `supplierId`: Required, must exist
- `unitCost`: Required, > 0
- `safetyStock`: Required, >= 0
- `leadTimeDays`: Required, > 0

### Update Material

**Endpoint**:
```http
PUT /api/v1/materials/{id}
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "name": "Aluminum Plate B2 Updated",
  "unitCost": 26.00,
  "safetyStock": 250
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "mat-uuid-002",
    "sku": "MAT-002",
    "name": "Aluminum Plate B2 Updated",
    "unitCost": 26.00,
    "safetyStock": 250,
    "updatedAt": "2026-07-03T15:30:00Z"
  }
}
```

### Delete Material

**Endpoint**:
```http
DELETE /api/v1/materials/{id}
Authorization: Bearer {token}
```

**Response** (204 No Content):
```
No response body
```

---

## Inventory Service API

**Base Path**: `/inventory`

### List Inventory

**Endpoint**:
```http
GET /api/v1/inventory?warehouseId=&materialId=&page=0&size=20
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "inv-uuid-001",
      "material": {
        "id": "mat-001",
        "sku": "MAT-001",
        "name": "Steel Plate A1"
      },
      "warehouse": {
        "id": "wh-001",
        "name": "US West Warehouse"
      },
      "quantityOnHand": 1500,
      "quantityReserved": 200,
      "quantityInTransit": 500,
      "quantityAvailableForSale": 1300,
      "reorderPoint": 100,
      "reorderQuantity": 500,
      "lastMovementAt": "2026-07-03T10:00:00Z",
      "lastCountedAt": "2026-07-01T08:00:00Z",
      "updatedAt": "2026-07-03T10:00:00Z"
    }
  ]
}
```

### Get Inventory Detail

**Endpoint**:
```http
GET /api/v1/inventory/{materialId}?warehouseId=
```

**Response**:
Similar to list response above for single item.

### Adjust Inventory

**Endpoint**:
```http
POST /api/v1/inventory/adjust
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "materialId": "mat-001",
  "warehouseId": "wh-001",
  "adjustmentType": "INCREASE",
  "quantity": 100,
  "reason": "CORRECTION",
  "referenceId": "PHYS-COUNT-001",
  "notes": "Physical count correction"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "inventoryId": "inv-001",
    "movementId": "mov-uuid-001",
    "newQuantityOnHand": 1600,
    "adjustedAt": "2026-07-03T15:45:00Z"
  }
}
```

### Reserve Stock

**Endpoint**:
```http
POST /api/v1/inventory/reserve
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "materialId": "mat-001",
  "warehouseId": "wh-001",
  "quantity": 50,
  "orderId": "order-001",
  "expiryMinutes": 30
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "reservationId": "res-uuid-001",
    "materialId": "mat-001",
    "quantityReserved": 50,
    "expiresAt": "2026-07-03T16:15:00Z",
    "availableQuantity": 1550
  }
}
```

### Release Reservation

**Endpoint**:
```http
POST /api/v1/inventory/release/{reservationId}
Authorization: Bearer {token}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "reservationId": "res-uuid-001",
    "quantityReleased": 50,
    "releasedAt": "2026-07-03T16:00:00Z"
  }
}
```

### Get Low Stock Items

**Endpoint**:
```http
GET /api/v1/inventory/low-stock?warehouseId=&threshold=
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "materialId": "mat-005",
      "sku": "MAT-005",
      "name": "Component X",
      "warehouseId": "wh-001",
      "currentQuantity": 50,
      "reorderPoint": 100,
      "quantityBelow": 50,
      "recommendedOrderQuantity": 500
    }
  ]
}
```

### Get Inventory Movements

**Endpoint**:
```http
GET /api/v1/inventory/movements?materialId=&warehouseId=&startDate=&endDate=&page=0&size=20
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "mov-uuid-001",
      "materialId": "mat-001",
      "warehouseId": "wh-001",
      "movementType": "RECEIPT",
      "quantity": 500,
      "referenceType": "ORDER",
      "referenceId": "order-001",
      "notes": "Purchase order receipt",
      "createdAt": "2026-07-03T10:00:00Z",
      "createdBy": "warehouse@example.com"
    }
  ]
}
```

---

## Order Service API

**Base Path**: `/orders`

### List Orders

**Endpoint**:
```http
GET /api/v1/orders?page=0&size=20&status=&orderType=&supplierId=
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "order-uuid-001",
      "orderNumber": "PO-2026-0001",
      "orderType": "PO",
      "status": "CONFIRMED",
      "supplier": {
        "id": "sup-001",
        "name": "Acme Supplies"
      },
      "orderDate": "2026-07-01",
      "expectedDeliveryDate": "2026-07-08",
      "totalAmount": 5000.00,
      "currency": "USD",
      "itemCount": 3,
      "createdAt": "2026-07-01T10:00:00Z"
    }
  ]
}
```

### Get Order Detail

**Endpoint**:
```http
GET /api/v1/orders/{id}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "order-uuid-001",
    "orderNumber": "PO-2026-0001",
    "orderType": "PO",
    "status": "CONFIRMED",
    "supplier": {
      "id": "sup-001",
      "name": "Acme Supplies"
    },
    "orderDate": "2026-07-01",
    "expectedDeliveryDate": "2026-07-08",
    "totalAmount": 5000.00,
    "currency": "USD",
    "paymentStatus": "PENDING",
    "items": [
      {
        "id": "oi-uuid-001",
        "material": {
          "id": "mat-001",
          "sku": "MAT-001",
          "name": "Steel Plate A1"
        },
        "quantityOrdered": 100,
        "quantityReceived": 0,
        "unitPrice": 45.50,
        "lineTotal": 4550.00,
        "warehouse": {
          "id": "wh-001",
          "name": "US West"
        },
        "status": "PENDING"
      }
    ],
    "notes": "Rush delivery requested",
    "createdAt": "2026-07-01T10:00:00Z",
    "createdBy": "buyer@example.com"
  }
}
```

### Create Order

**Endpoint**:
```http
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "orderType": "PO",
  "supplierId": "sup-001",
  "expectedDeliveryDate": "2026-07-10",
  "items": [
    {
      "materialId": "mat-001",
      "quantityOrdered": 100,
      "unitPrice": 45.50,
      "warehouseId": "wh-001"
    },
    {
      "materialId": "mat-002",
      "quantityOrdered": 50,
      "unitPrice": 25.75,
      "warehouseId": "wh-001"
    }
  ],
  "notes": "Standard order"
}
```

**Response** (201 Created):
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "order-uuid-001",
    "orderNumber": "PO-2026-0001",
    "orderType": "PO",
    "status": "DRAFT",
    "totalAmount": 5000.00,
    "createdAt": "2026-07-03T16:00:00Z"
  }
}
```

### Update Order Status

**Endpoint**:
```http
PUT /api/v1/orders/{id}/status
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "status": "SUBMITTED"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "order-uuid-001",
    "orderNumber": "PO-2026-0001",
    "status": "SUBMITTED",
    "updatedAt": "2026-07-03T16:30:00Z"
  }
}
```

### Receive Order

**Endpoint**:
```http
POST /api/v1/orders/{id}/receive
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "receivingDate": "2026-07-05",
  "items": [
    {
      "orderItemId": "oi-uuid-001",
      "quantityReceived": 100,
      "inspectionStatus": "ACCEPTED"
    }
  ],
  "notes": "All items received in good condition"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "orderId": "order-uuid-001",
    "receiptId": "receipt-uuid-001",
    "totalReceived": 100,
    "receivedAt": "2026-07-05T10:00:00Z"
  }
}
```

### Cancel Order

**Endpoint**:
```http
POST /api/v1/orders/{id}/cancel
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "reason": "Supplier unable to fulfill",
  "notes": "Find alternative supplier"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "orderId": "order-uuid-001",
    "status": "CANCELLED",
    "cancelledAt": "2026-07-03T17:00:00Z"
  }
}
```

---

## Warehouse Service API

**Base Path**: `/warehouses`

### List Warehouses

**Endpoint**:
```http
GET /api/v1/warehouses?page=0&size=20&isActive=true
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "wh-uuid-001",
      "code": "WH-US-WEST",
      "name": "US West Warehouse",
      "address": {
        "street": "123 Industrial Blvd",
        "city": "Los Angeles",
        "state": "CA",
        "country": "USA"
      },
      "coordinates": {
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "totalCapacity": 50000,
      "usedCapacity": 38000,
      "availableCapacity": 12000,
      "utilizationPercentage": 76,
      "isActive": true,
      "manager": {
        "id": "user-001",
        "name": "John Manager"
      }
    }
  ]
}
```

### Get Warehouse Locations

**Endpoint**:
```http
GET /api/v1/warehouses/{id}/locations
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "warehouseId": "wh-uuid-001",
    "warehouseName": "US West Warehouse",
    "locations": [
      {
        "id": "loc-uuid-001",
        "aisle": "A",
        "rack": "1",
        "bin": "001",
        "level": "1",
        "capacity": 100,
        "usedCapacity": 75,
        "availableCapacity": 25,
        "isAvailable": true,
        "material": {
          "id": "mat-001",
          "sku": "MAT-001",
          "name": "Steel Plate A1",
          "quantity": 75
        }
      }
    ]
  }
}
```

---

## Supplier Service API

**Base Path**: `/suppliers`

### List Suppliers

**Endpoint**:
```http
GET /api/v1/suppliers?page=0&size=20&status=ACTIVE
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "id": "sup-uuid-001",
      "code": "SUP-001",
      "name": "Acme Supplies Inc.",
      "industry": "Manufacturing",
      "email": "sales@acme.com",
      "phone": "+1-555-0100",
      "status": "ACTIVE",
      "rating": 4.5,
      "totalOrders": 150,
      "totalSpent": 450000.00,
      "averageLeadTimeDays": 7,
      "onTimeDeliveryRate": 98.5,
      "qualityScore": 99.2
    }
  ]
}
```

### Get Supplier Performance

**Endpoint**:
```http
GET /api/v1/suppliers/{id}/performance
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "supplierId": "sup-uuid-001",
    "onTimeDeliveryRate": 98.5,
    "qualityAcceptanceRate": 99.2,
    "averageLeadTimeDays": 7,
    "totalOrders": 150,
    "totalSpent": 450000.00,
    "lastOrderDate": "2026-07-03",
    "calculatedAt": "2026-07-03T10:00:00Z",
    "trend": "IMPROVING",
    "topCategories": [
      {
        "category": "Raw Materials",
        "orders": 80,
        "spent": 250000.00
      }
    ]
  }
}
```

### Rate Supplier

**Endpoint**:
```http
POST /api/v1/suppliers/{id}/rating
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "rating": 4.5,
  "comment": "Excellent supplier with reliable delivery",
  "communicationScore": 5,
  "qualityScore": 4,
  "reliabilityScore": 5
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "supplierId": "sup-uuid-001",
    "overallRating": 4.6,
    "ratedAt": "2026-07-03T17:00:00Z",
    "ratedBy": "manager@example.com"
  }
}
```

---

## User Service API

**Base Path**: `/users`

### Login

**Endpoint**:
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "john.doe",
  "password": "secure_password"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user-uuid-001",
      "username": "john.doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["INVENTORY_MANAGER"],
      "permissions": ["MATERIAL_READ", "MATERIAL_WRITE", "INVENTORY_READ"]
    }
  }
}
```

### Logout

**Endpoint**:
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

**Response** (204 No Content):
```
No response body
```

### Get Current User

**Endpoint**:
```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "id": "user-uuid-001",
    "username": "john.doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "department": "Inventory Management",
    "roles": ["INVENTORY_MANAGER"],
    "permissions": ["MATERIAL_READ", "MATERIAL_WRITE", "INVENTORY_READ"],
    "lastLogin": "2026-07-03T10:00:00Z"
  }
}
```

### Change Password

**Endpoint**:
```http
POST /api/v1/auth/change-password
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "data": {
    "message": "Password changed successfully",
    "changedAt": "2026-07-03T17:30:00Z"
  }
}
```

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse.

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1625334600
```

### Limits by Role
| Role | Requests/Minute |
|------|-----------------|
| Admin | 300 |
| Manager | 200 |
| User | 100 |
| Guest | 30 |

### Response When Limit Exceeded (429)
```json
{
  "status": "ERROR",
  "code": 429,
  "message": "Too many requests",
  "retryAfter": 60
}
```

---

## Webhooks

### Webhook Events

**Material Events**:
- `material.created`
- `material.updated`
- `material.deleted`

**Order Events**:
- `order.created`
- `order.submitted`
- `order.fulfilled`
- `order.cancelled`

**Inventory Events**:
- `inventory.updated`
- `inventory.low_stock_alert`
- `inventory.transferred`

### Register Webhook

**Endpoint**:
```http
POST /api/v1/webhooks
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "url": "https://myapp.com/webhooks/mms",
  "events": ["order.created", "order.fulfilled"],
  "active": true
}
```

### Webhook Payload Example

```json
{
  "event": "order.created",
  "timestamp": "2026-07-03T10:30:00Z",
  "data": {
    "id": "order-uuid-001",
    "orderNumber": "PO-2026-0001",
    "orderType": "PO",
    "status": "DRAFT",
    "totalAmount": 5000.00
  },
  "signature": "sha256=abcdef123456..."
}
```

---

**Document Version**: 1.0  
**Last Updated**: July 3, 2026  
**Status**: Complete
