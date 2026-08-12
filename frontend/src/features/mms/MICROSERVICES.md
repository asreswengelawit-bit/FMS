# Material Management System (MMS) - Microservices Documentation

## Overview

This document provides detailed information about each microservice in the MMS platform, including responsibilities, API contracts, inter-service communication, and deployment guidelines.

---

## Table of Contents

1. [Service Communication Patterns](#service-communication-patterns)
2. [API Gateway Service](#api-gateway-service)
3. [Material Service](#material-service)
4. [Inventory Service](#inventory-service)
5. [Warehouse Service](#warehouse-service)
6. [Order Service](#order-service)
7. [Supplier Service](#supplier-service)
8. [Analytics Service](#analytics-service)
9. [Notification Service](#notification-service)
10. [User Service](#user-service)
11. [Cross-Service Concerns](#cross-service-concerns)

---

## Service Communication Patterns

### REST API Convention

All services follow REST conventions:

```
GET    /api/v1/resources           → List resources
POST   /api/v1/resources           → Create resource
GET    /api/v1/resources/{id}      → Get resource detail
PUT    /api/v1/resources/{id}      → Update resource
DELETE /api/v1/resources/{id}      → Delete resource
```

### Request/Response Format

**Standard Request**:
```json
{
  "name": "Standard Material",
  "description": "Description",
  "unitOfMeasure": "PCS"
}
```

**Standard Response (Success)**:
```json
{
  "status": "SUCCESS",
  "code": 200,
  "message": "Operation successful",
  "data": {
    "id": "uuid",
    "name": "Standard Material"
  },
  "timestamp": "2026-07-03T10:30:00Z"
}
```

**Standard Response (Error)**:
```json
{
  "status": "ERROR",
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ],
  "timestamp": "2026-07-03T10:30:00Z"
}
```

### Pagination

```json
{
  "status": "SUCCESS",
  "data": [...],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## API Gateway Service

**Port**: 8080  
**Purpose**: Single entry point for all client requests  
**Technology**: Spring Cloud Gateway

### Responsibilities

- Request routing to appropriate microservice
- Authentication and authorization
- Rate limiting
- Request/response logging
- API versioning
- Load balancing
- Circuit breaking

### Configuration

```yaml
# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: material-service
          uri: http://material-service:8001
          predicates:
            - Path=/api/v1/materials/**
          filters:
            - name: CircuitBreaker
              args:
                name: materialServiceBreaker
        
        - id: inventory-service
          uri: http://inventory-service:8002
          predicates:
            - Path=/api/v1/inventory/**
        
        - id: order-service
          uri: http://order-service:8004
          predicates:
            - Path=/api/v1/orders/**
      
      default-filters:
        - name: RequestRateLimiter
          args:
            redis-rate-limiter.replenishRate: 100
            redis-rate-limiter.burstCapacity: 200
        - name: SaveSession
```

### Key Endpoints

```
POST   /api/v1/auth/login       → User login
GET    /api/v1/health           → Health check
GET    /api/v1/health/live      → Liveness probe
GET    /api/v1/health/ready     → Readiness probe
```

---

## Material Service

**Port**: 8001  
**Database**: PostgreSQL (materials table)  
**Cache**: Redis (material:{id})

### Responsibilities

- Master data management for materials
- Material CRUD operations
- Material categorization
- Supplier linkage
- Search and filtering
- Audit trail maintenance

### Database Schema

```sql
CREATE TABLE materials (
    id UUID PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID,
    unit_of_measure VARCHAR(20) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    unit_cost DECIMAL(10, 2),
    safety_stock INTEGER,
    lead_time_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_materials_sku ON materials(sku);
CREATE INDEX idx_materials_supplier_id ON materials(supplier_id);
CREATE INDEX idx_materials_is_active ON materials(is_active);
```

### API Endpoints

```
GET    /api/v1/materials
POST   /api/v1/materials
GET    /api/v1/materials/{id}
PUT    /api/v1/materials/{id}
DELETE /api/v1/materials/{id}
GET    /api/v1/materials/search?q={query}
GET    /api/v1/materials/{id}/history
GET    /api/v1/materials/{id}/usage
POST   /api/v1/materials/bulk-import
```

### Create Material Request

```json
{
  "sku": "MAT-001",
  "name": "Steel Plate A1",
  "description": "High-grade steel plate",
  "categoryId": "cat-001",
  "unitOfMeasure": "kg",
  "supplierId": "sup-001",
  "unitCost": 45.50,
  "safetyStock": 100,
  "leadTimeDays": 7
}
```

### Create Material Response

```json
{
  "status": "SUCCESS",
  "data": {
    "id": "mat-uuid-001",
    "sku": "MAT-001",
    "name": "Steel Plate A1",
    "unitCost": 45.50,
    "safetyStock": 100,
    "leadTimeDays": 7,
    "supplier": {
      "id": "sup-001",
      "name": "Supplier A"
    },
    "createdAt": "2026-07-03T10:30:00Z",
    "createdBy": "user@example.com"
  }
}
```

### Events Published

- `MaterialCreated`: New material added
- `MaterialUpdated`: Material details changed
- `MaterialDeleted`: Material marked inactive
- `MaterialPriceChanged`: Cost updated
- `MaterialSafetyStockChanged`: Safety stock updated

### Events Consumed

- (None initially)

### Service Dependencies

- PostgreSQL
- Redis
- RabbitMQ

---

## Inventory Service

**Port**: 8002  
**Database**: PostgreSQL (inventory table)  
**Cache**: Redis (inventory:{warehouseId}:{materialId})

### Responsibilities

- Real-time stock level tracking
- Multi-warehouse inventory management
- Stock reservations and releases
- Low-stock alerts
- Inventory adjustments
- Movement history
- Stock level forecasting

### Database Schema

```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY,
    material_id UUID NOT NULL REFERENCES materials(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    location_id UUID REFERENCES locations(id),
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    quantity_in_transit INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER NOT NULL,
    reorder_quantity INTEGER NOT NULL,
    last_counted_at TIMESTAMP,
    last_movement_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(material_id, warehouse_id)
);

CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY,
    inventory_id UUID NOT NULL REFERENCES inventory(id),
    material_id UUID NOT NULL,
    warehouse_id UUID NOT NULL,
    movement_type VARCHAR(20) NOT NULL, -- RECEIPT, ISSUE, ADJUSTMENT, TRANSFER
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20), -- ORDER, TRANSFER, ADJUSTMENT
    reference_id VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE INDEX idx_inventory_movements_inventory_id 
    ON inventory_movements(inventory_id);
CREATE INDEX idx_inventory_movements_created_at 
    ON inventory_movements(created_at);
```

### API Endpoints

```
GET    /api/v1/inventory
POST   /api/v1/inventory/adjust
GET    /api/v1/inventory/{materialId}
GET    /api/v1/inventory/warehouse/{warehouseId}
POST   /api/v1/inventory/reserve
POST   /api/v1/inventory/release
GET    /api/v1/inventory/low-stock
GET    /api/v1/inventory/movements
GET    /api/v1/inventory/movements/{materialId}
POST   /api/v1/inventory/transfer
POST   /api/v1/inventory/count
```

### Adjust Inventory Request

```json
{
  "materialId": "mat-001",
  "warehouseId": "wh-001",
  "adjustmentType": "INCREASE",
  "quantity": 50,
  "reason": "CORRECTION",
  "referenceId": "PHYS-COUNT-001",
  "notes": "Physical count correction"
}
```

### Reserve Stock Request

```json
{
  "materialId": "mat-001",
  "warehouseId": "wh-001",
  "quantity": 10,
  "orderId": "order-001",
  "expiryMinutes": 30
}
```

### Events Published

- `InventoryUpdated`: Stock level changed
- `LowStockAlert`: Stock below reorder point
- `StockReserved`: Stock reserved for order
- `StockReleased`: Reservation cancelled
- `InventoryTransferred`: Stock moved between warehouses
- `InventoryReceived`: New stock received

### Events Consumed

- `MaterialCreated`: Create initial inventory entries
- `OrderCreated`: Process order and reserve stock
- `OrderFulfilled`: Reduce stock and release reservation
- `OrderCancelled`: Release stock reservation

### Service Dependencies

- Material Service (lookup material details)
- Warehouse Service (validate warehouse locations)
- Notification Service (low-stock alerts)
- PostgreSQL
- Redis
- RabbitMQ

---

## Warehouse Service

**Port**: 8003  
**Database**: PostgreSQL (warehouses, locations tables)

### Responsibilities

- Warehouse master data management
- Location/bin management
- Capacity tracking and planning
- Zone management
- Picking/packing operations
- Receiving operations

### Database Schema

```sql
CREATE TABLE warehouses (
    id UUID PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zones (
    id UUID PRIMARY KEY,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    zone_type VARCHAR(20), -- RECEIVING, STORAGE, PICKING, PACKING, SHIPPING
    capacity INTEGER,
    UNIQUE(warehouse_id, code)
);

CREATE TABLE locations (
    id UUID PRIMARY KEY,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    zone_id UUID REFERENCES zones(id),
    aisle VARCHAR(10) NOT NULL,
    rack VARCHAR(10) NOT NULL,
    bin VARCHAR(10) NOT NULL,
    level VARCHAR(10),
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, aisle, rack, bin, level)
);
```

### API Endpoints

```
GET    /api/v1/warehouses
POST   /api/v1/warehouses
GET    /api/v1/warehouses/{id}
PUT    /api/v1/warehouses/{id}
DELETE /api/v1/warehouses/{id}
GET    /api/v1/warehouses/{id}/locations
POST   /api/v1/warehouses/{id}/zones
GET    /api/v1/warehouses/{id}/zones
GET    /api/v1/warehouses/{id}/capacity
POST   /api/v1/locations
PUT    /api/v1/locations/{id}
GET    /api/v1/locations/{id}/inventory
```


```json
{
  "code": "WH-US-WEST",
- `CapacityAlert`: Warehouse near capacity

### Events Consumed

- `InventoryUpdated`: Track location usage
- `OrderFulfilled`: Update location availability

### Service Dependencies

- PostgreSQL
- Inventory Service (location assignments)

---

## Order Service

**Port**: 8004  
**Database**: PostgreSQL (orders, order_items tables)

### Responsibilities

- Purchase order (PO) management
- Sales order (SO) management
- Order tracking
- Receiving operations
- Delivery scheduling
- Order history and analytics

### Database Schema

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type VARCHAR(20) NOT NULL, -- PO, SO
    supplier_id UUID REFERENCES suppliers(id),
    order_date TIMESTAMP NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status VARCHAR(20) NOT NULL, -- DRAFT, SUBMITTED, CONFIRMED, PARTIAL, RECEIVED, CANCELLED
    total_amount DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    material_id UUID NOT NULL REFERENCES materials(id),
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    line_total DECIMAL(15, 2),
    warehouse_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

```
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/{id}
PUT    /api/v1/orders/{id}
PUT    /api/v1/orders/{id}/status
POST   /api/v1/orders/{id}/items
POST   /api/v1/orders/{id}/receive
POST   /api/v1/orders/{id}/cancel
GET    /api/v1/orders/supplier/{supplierId}
GET    /api/v1/orders/warehouse/{warehouseId}
```

### Create Order Request

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
    }
  ],
  "notes": "Rush order"
}
```

### Receive Order Request

```json
{
  "receivingDate": "2026-07-05",
  "items": [
    {
      "orderItemId": "oi-001",
      "quantityReceived": 100,
      "inspectionStatus": "ACCEPTED"
    }
  ]
}
```

### Events Published

- `OrderCreated`: New order created
- `OrderUpdated`: Order details changed
- `OrderSubmitted`: Order submitted to supplier
- `OrderConfirmed`: Supplier confirmed order
- `OrderFulfilled`: All items received
- `OrderCancelled`: Order cancelled
- `OrderDeliveryExpected`: Delivery date approaching

### Events Consumed

- `MaterialCreated`: Update material list
- `SupplierUpdated`: Update supplier info
- `InventoryLowStock`: Auto-create POs for low-stock items

### Service Dependencies

- Material Service
- Supplier Service
- Inventory Service (reserve/release stock)
- Notification Service
- PostgreSQL

---

## Supplier Service

**Port**: 8005  
**Database**: PostgreSQL (suppliers, supplier_contacts, supplier_contracts tables)

### Responsibilities

- Supplier master data management
- Contact information management
- Contract and terms management
- Performance metrics
- Rating and evaluation system
- Communication history

### Database Schema

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100),
    payment_terms VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, BLOCKED
    rating DECIMAL(3, 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_contacts (
    id UUID PRIMARY KEY,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    is_primary BOOLEAN DEFAULT false
);

CREATE TABLE supplier_performance (
    id UUID PRIMARY KEY,
    supplier_id UUID NOT NULL UNIQUE REFERENCES suppliers(id),
    on_time_delivery_rate DECIMAL(5, 2),
    quality_acceptance_rate DECIMAL(5, 2),
    average_lead_time_days INTEGER,
    total_orders INTEGER,
    total_spent DECIMAL(15, 2),
    last_order_date TIMESTAMP,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

```
GET    /api/v1/suppliers
POST   /api/v1/suppliers
GET    /api/v1/suppliers/{id}
PUT    /api/v1/suppliers/{id}
DELETE /api/v1/suppliers/{id}
GET    /api/v1/suppliers/{id}/performance
GET    /api/v1/suppliers/{id}/contracts
POST   /api/v1/suppliers/{id}/rating
GET    /api/v1/suppliers/{id}/orders
```

### Create Supplier Request

```json
{
  "code": "SUP-001",
  "name": "Acme Supplies Inc.",
  "industry": "Manufacturing",
  "website": "https://acme.com",
  "email": "sales@acme.com",
  "phone": "+1-555-0100",
  "addressStreet": "123 Industrial Blvd",
  "addressCity": "Chicago",
  "addressState": "IL",
  "addressCountry": "USA",
  "paymentTerms": "NET 30",
  "contacts": [
    {
      "name": "John Smith",
      "title": "Sales Manager",
      "email": "john@acme.com",
      "phone": "+1-555-0101",
      "isPrimary": true
    }
  ]
}
```

### Supplier Performance Response

```json
{
  "supplierId": "sup-001",
  "onTimeDeliveryRate": 98.5,
  "qualityAcceptanceRate": 99.2,
  "averageLeadTimeDays": 7,
  "totalOrders": 150,
  "totalSpent": 450000.00,
  "lastOrderDate": "2026-06-30",
  "calculatedAt": "2026-07-03T10:00:00Z"
}
```

### Events Published

- `SupplierCreated`: New supplier added
- `SupplierUpdated`: Supplier details changed
- `SupplierDeactivated`: Supplier marked inactive
- `SupplierRated`: Supplier rating updated

### Events Consumed

- `OrderCreated`: Track supplier activity
- `OrderFulfilled`: Calculate performance metrics

### Service Dependencies

- Order Service (performance calculation)
- PostgreSQL

---

## Analytics Service

**Port**: 8006  
**Database**: PostgreSQL (analytics schema)  
**Cache**: Redis

### Responsibilities

- Real-time and historical analytics
- Dashboard data aggregation
- Report generation
- KPI calculations
- Demand forecasting
- Business intelligence

### Key Metrics & Reports

**Real-Time Metrics**:
- Current inventory value
- Orders pending
- Inventory turnover
- Stock-out risk items
- Warehouse utilization

**Historical Reports**:
- Inventory movement trends
- Supplier performance
- Order fulfillment metrics
- Cost analysis
- Demand forecasts

### API Endpoints

```
GET    /api/v1/analytics/dashboards
GET    /api/v1/analytics/dashboards/{dashboardId}
GET    /api/v1/analytics/kpis
GET    /api/v1/analytics/reports
POST   /api/v1/analytics/reports/generate
GET    /api/v1/analytics/trends/{metric}
GET    /api/v1/analytics/forecasts
POST   /api/v1/analytics/export/{reportId}
```

### KPI Response

```json
{
  "timestamp": "2026-07-03T10:30:00Z",
  "metrics": {
    "totalInventoryValue": 2500000.00,
    "totalMaterials": 5000,
    "totalWarehouses": 12,
    "averageInventoryTurnover": 8.5,
    "onTimeDeliveryRate": 97.8,
    "warehouseUtilization": 78.5,
    "lowStockItems": 45,
    "overStockItems": 23,
    "totalOrdersProcessed": 1250,
    "averageOrderFulfillmentDays": 4.2
  }
}
```

### Events Consumed

- All events from other services for aggregation
- `InventoryUpdated`
- `OrderCreated`, `OrderFulfilled`
- `MaterialCreated`, `MaterialUpdated`
- `SupplierUpdated`

### Service Dependencies

- All other services (data sources)
- PostgreSQL
- Redis

---

## Notification Service

**Port**: 8007  
**Database**: PostgreSQL (notifications, notification_preferences)  
**Cache**: Redis

### Responsibilities

- Multi-channel notifications
- Alert management
- User notification preferences
- Delivery tracking
- Retry logic for failed deliveries
- Notification scheduling

### Notification Channels

- Email
- SMS
- In-app notifications
- Webhook

### Database Schema

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    recipient_id UUID NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SENT, FAILED, DELIVERED, READ
    channels VARCHAR[] DEFAULT ARRAY['IN_APP'],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    read_at TIMESTAMP
);

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    in_app_enabled BOOLEAN DEFAULT true,
    low_stock_alert BOOLEAN DEFAULT true,
    order_alert BOOLEAN DEFAULT true,
    system_alert BOOLEAN DEFAULT true
);
```

### API Endpoints

```
GET    /api/v1/notifications
GET    /api/v1/notifications/{id}
PUT    /api/v1/notifications/{id}/read
GET    /api/v1/notifications/preferences
PUT    /api/v1/notifications/preferences
POST   /api/v1/notifications/send
```

### Send Notification Request

```json
{
  "recipientId": "user-001",
  "notificationType": "LOW_STOCK_ALERT",
  "title": "Low Stock Alert",
  "message": "Material MAT-001 stock is below reorder point",
  "channels": ["EMAIL", "IN_APP"],
  "data": {
    "materialId": "mat-001",
    "currentStock": 50,
    "reorderPoint": 100
  },
  "scheduleTime": "2026-07-03T14:00:00Z"
}
```

### Events Consumed

- `LowStockAlert`: Send low-stock notifications
- `OrderCreated`: Send order confirmation
- `OrderFulfilled`: Send fulfillment notification
- `InventoryUpdated`: Send stock level updates
- `MaterialCreated`: Notify relevant users

### Service Dependencies

- User Service (user preferences)
- Email Service (SMTP)
- SMS Provider (Twilio, AWS SNS)
- PostgreSQL
- Redis

---

## User Service

**Port**: 8008  
**Database**: PostgreSQL (users, roles, permissions)  
**Cache**: Redis (user sessions)

### Responsibilities

- User registration and management
- Authentication and authorization
- Role and permission management
- Session management
- Password management
- Audit logging

### Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    department VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id),
    role_id UUID NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50),
    action VARCHAR(20)
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id),
    permission_id UUID NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

### API Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/change-password
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}
GET    /api/v1/users/{id}/roles
POST   /api/v1/users/{id}/roles/{roleId}
DELETE /api/v1/users/{id}/roles/{roleId}
```

### Login Request

```json
{
  "username": "john.doe",
  "password": "secure_password"
}
```

### Login Response

```json
{
  "status": "SUCCESS",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user-001",
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

### Events Published

- `UserCreated`: New user registered
- `UserUpdated`: User details changed
- `UserDeactivated`: User account disabled
- `RoleAssigned`: User role changed
- `LoginAttempt`: User login attempt
- `PasswordChanged`: User changed password

### Service Dependencies

- PostgreSQL
- Redis

---

## Cross-Service Concerns

### Service Discovery

Services register themselves with Consul/Eureka:

```yaml
spring:
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        serviceName: material-service
        instanceId: ${spring.application.name}:${random.value}
        healthCheckInterval: 10s
```

### Circuit Breaker Pattern

```java
@Service
@RequiredArgsConstructor
public class InventoryServiceClient {

    private final WebClient webClient;

    @CircuitBreaker(name = "inventoryService", 
                   fallbackMethod = "getInventoryFallback")
    @Retry(name = "inventoryService")
    @Timeout(name = "inventoryService")
    public Inventory getInventory(String materialId, String warehouseId) {
        return webClient.get()
            .uri("/api/v1/inventory/{materialId}", materialId)
            .retrieve()
            .bodyToMono(Inventory.class)
            .block();
    }

    public Inventory getInventoryFallback(String materialId, 
                                         String warehouseId, 
                                         Exception ex) {
        log.error("Inventory service unavailable, returning default", ex);
        return new Inventory(materialId, warehouseId, 0, 0, 0);
    }
}
```

### Transactional Consistency

Services use the **Saga Pattern** for distributed transactions:

```java
@Service
@RequiredArgsConstructor
public class OrderSaga {

    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    private final NotificationClient notificationClient;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // Step 1: Create order
        Order order = orderRepository.save(new Order(request));

        try {
            // Step 2: Reserve inventory
            inventoryClient.reserve(order.getItems());
            
            // Step 3: Send confirmation
            notificationClient.sendOrderConfirmation(order);
            
            return order;
        } catch (Exception e) {
            // Step 4: Compensate (rollback)
            orderRepository.delete(order);
            throw new SagaExecutionException("Order creation failed", e);
        }
    }
}
```

### Monitoring & Health Checks

All services expose health endpoints:

```
GET /actuator/health
GET /actuator/health/liveness
GET /actuator/health/readiness
GET /actuator/metrics
GET /actuator/prometheus
```

---

**Document Version**: 1.0  
**Last Updated**: July 3, 2026  
**Status**: Complete
