# Material Management System (MMS) - Architecture Documentation

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Microservices Architecture](#microservices-architecture)
3. [Technology Stack](#technology-stack)
4. [Data Flow](#data-flow)
5. [Communication Patterns](#communication-patterns)
6. [Deployment Architecture](#deployment-architecture)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Layer                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Web Browser (React SPA)                            │    │
│  │  - Dashboard                                        │    │
│  │  - Material Management                              │    │
│  │  - Inventory Tracking                               │    │
│  │  - Warehouse Layout & Operations                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Edge Layer (CDN)                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  CloudFlare/Akamai - Static Assets Caching          │    │
│  │  - Images, CSS, JavaScript                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Load Balancer                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Nginx/HAProxy                                       │    │
│  │  - SSL/TLS Termination                              │    │
│  │  - Request Routing                                  │    │
│  │  - Session Persistence                              │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                         ↓ HTTP/2
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Spring Cloud Gateway / Kong                        │    │
│  │  - Request Routing                                  │    │
│  │  - Authentication/Authorization                     │    │
│  │  - Rate Limiting                                    │    │
│  │  - Request/Response Transformation                  │    │
│  │  - Circuit Breaker                                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                         ↓ gRPC/HTTP
┌─────────────────────────────────────────────────────────────┐
│               Microservices Cluster                          │
│  (Details in next section)                                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               Message Broker Layer                           │
│  (RabbitMQ)                                                  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Data Layer                                  │
│  (PostgreSQL, Redis)                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Microservices Architecture

### Service Catalog

#### 1. Material Service
**Responsibility**: Master data management for materials
```
├── API Endpoints
│   ├── GET    /api/v1/materials
│   ├── POST   /api/v1/materials
│   ├── GET    /api/v1/materials/{id}
│   ├── PUT    /api/v1/materials/{id}
│   ├── DELETE /api/v1/materials/{id}
│   ├── GET    /api/v1/materials/search
│   └── GET    /api/v1/materials/{id}/history
│
├── Dependencies
│   └── PostgreSQL (Material table)
│   └── Redis (Material cache)
│
├── Events Published
│   ├── MaterialCreated
│   ├── MaterialUpdated
│   └── MaterialDeleted
│
└── Events Consumed
    └── (None initially)
```

**Key Features**:
- CRUD operations for materials
- Material categorization
- Unit of measure management
- Supplier linkage
- Audit trail
- Search and filtering

---

#### 2. Inventory Service
**Responsibility**: Real-time inventory tracking and management
```
├── API Endpoints
│   ├── GET    /api/v1/inventory
│   ├── POST   /api/v1/inventory/adjust
│   ├── GET    /api/v1/inventory/{materialId}
│   ├── POST   /api/v1/inventory/reserve
│   ├── POST   /api/v1/inventory/release
│   ├── GET    /api/v1/inventory/low-stock
│   └── GET    /api/v1/inventory/movements
│
├── Dependencies
│   ├── PostgreSQL (Inventory table)
│   ├── Redis (Inventory cache)
│   └── Material Service
│
├── Events Published
│   ├── InventoryUpdated
│   ├── LowStockAlert
│   ├── StockReserved
│   └── StockReleased
│
└── Events Consumed
    ├── MaterialCreated
    ├── OrderCreated
    ├── OrderFulfilled
    └── OrderCancelled
```

**Key Features**:
- Real-time stock level tracking
- Multi-warehouse inventory
- Stock reservations
- Low stock alerts
- Inventory adjustments
- Movement history

---

#### 3. Warehouse Service
**Responsibility**: Physical warehouse operations
```
├── API Endpoints
│   ├── GET    /api/v1/warehouses
│   ├── POST   /api/v1/warehouses
│   ├── GET    /api/v1/warehouses/{id}
│   ├── PUT    /api/v1/warehouses/{id}
│   ├── GET    /api/v1/warehouses/{id}/locations
│   ├── GET    /api/v1/warehouses/{id}/zones
│   ├── POST   /api/v1/locations
│   ├── GET    /api/v1/locations/{id}/capacity
│   └── PUT    /api/v1/locations/{id}
│
├── Dependencies
│   ├── PostgreSQL (Warehouse, Location tables)
│   ├── Inventory Service
│   └── Material Service
│
├── Events Published
│   ├── WarehouseCreated
│   ├── WarehouseUpdated
│   ├── LocationAssigned
│   └── LocationUpdated
│
└── Events Consumed
    └── InventoryUpdated
```

**Key Features**:
- Warehouse management (multiple locations)
- Location/bin management
- Capacity planning
- Zone management
- 3D layout visualization
- Picking/packing operations

---

#### 4. Order Service
**Responsibility**: Purchase and sales order management
```
├── API Endpoints
│   ├── GET    /api/v1/orders
│   ├── POST   /api/v1/orders
│   ├── GET    /api/v1/orders/{id}
│   ├── PUT    /api/v1/orders/{id}/status
│   ├── POST   /api/v1/orders/{id}/receive
│   ├── POST   /api/v1/orders/{id}/cancel
│   └── GET    /api/v1/orders/{id}/items
│
├── Dependencies
│   ├── PostgreSQL (Order, OrderItem tables)
│   ├── Material Service
│   ├── Supplier Service
│   ├── Inventory Service
│   └── Notification Service
│
├── Events Published
│   ├── OrderCreated
│   ├── OrderUpdated
│   ├── OrderFulfilled
│   ├── OrderCancelled
│   └── OrderDeliveryExpected
│
└── Events Consumed
    ├── MaterialCreated
    ├── SupplierUpdated
    └── InventoryUpdated
```

**Key Features**:
- Purchase order (PO) management
- Sales order (SO) management
- Order tracking
- Receiving operations
- Delivery scheduling
- Order history

---

#### 5. Supplier Service
**Responsibility**: Supplier master data and relationship management
```
├── API Endpoints
│   ├── GET    /api/v1/suppliers
│   ├── POST   /api/v1/suppliers
│   ├── GET    /api/v1/suppliers/{id}
│   ├── PUT    /api/v1/suppliers/{id}
│   ├── GET    /api/v1/suppliers/{id}/performance
│   ├── GET    /api/v1/suppliers/{id}/contracts
│   └── POST   /api/v1/suppliers/{id}/rating
│
├── Dependencies
│   └── PostgreSQL (Supplier table)
│
├── Events Published
│   ├── SupplierCreated
│   ├── SupplierUpdated
│   └── SupplierDeactivated
│
└── Events Consumed
    └── OrderCreated
```

**Key Features**:
- Supplier master data
- Contact information
- Contract management
- Performance metrics
- Rating system
- Communication history

---

#### 6. Analytics Service
**Responsibility**: Data aggregation, analysis, and reporting
```
├── API Endpoints
│   ├── GET    /api/v1/analytics/dashboards
│   ├── GET    /api/v1/analytics/reports
│   ├── POST   /api/v1/analytics/reports/generate
│   ├── GET    /api/v1/analytics/kpis
│   ├── GET    /api/v1/analytics/trends
│   └── GET    /api/v1/analytics/forecasts
│
├── Dependencies
│   ├── PostgreSQL (Analytics schema)
│   ├── Redis (Aggregated metrics cache)
│   ├── Material Service
│   ├── Inventory Service
│   ├── Order Service
│   └── Supplier Service
│
├── Events Consumed
│   ├── InventoryUpdated
│   ├── OrderCreated
│   ├── OrderFulfilled
│   ├── MaterialCreated
│   └── SupplierUpdated
│
└── Data Processing
    ├── Stream processing (real-time metrics)
    ├── Batch processing (historical aggregation)
    └── Forecast models (demand forecasting)
```

**Key Features**:
- Real-time dashboard metrics
- Historical analysis
- Report generation
- KPI tracking
- Demand forecasting
- Supplier performance analytics

---

#### 7. Notification Service
**Responsibility**: Multi-channel notifications and alerting
```
├── API Endpoints
│   ├── GET    /api/v1/notifications
│   ├── POST   /api/v1/notifications/send
│   ├── PUT    /api/v1/notifications/{id}/read
│   ├── GET    /api/v1/notifications/preferences
│   └── PUT    /api/v1/notifications/preferences
│
├── Dependencies
│   ├── Email service (SMTP)
│   ├── SMS provider (Twilio/AWS SNS)
│   ├── Push notification service
│   └── Redis (Notification cache)
│
├── Events Consumed
│   ├── LowStockAlert
│   ├── OrderCreated
│   ├── OrderFulfilled
│   ├── OrderDeliveryExpected
│   └── MaterialUpdated
│
└── Notification Channels
    ├── Email
    ├── SMS
    ├── In-app notifications
    └── Webhook (third-party integrations)
```

**Key Features**:
- Multi-channel notifications
- Alert management
- Notification preferences
- Scheduling
- Retry logic
- Delivery tracking

---

#### 8. User Service
**Responsibility**: User management, authentication, and authorization
```
├── API Endpoints
│   ├── POST   /api/v1/auth/login
│   ├── POST   /api/v1/auth/logout
│   ├── POST   /api/v1/auth/refresh-token
│   ├── GET    /api/v1/users
│   ├── POST   /api/v1/users
│   ├── GET    /api/v1/users/{id}
│   ├── PUT    /api/v1/users/{id}
│   ├── GET    /api/v1/users/{id}/roles
│   └── POST   /api/v1/users/{id}/roles
│
├── Dependencies
│   ├── PostgreSQL (User, Role, Permission tables)
│   └── Redis (Session storage, token cache)
│
├── Events Published
│   ├── UserCreated
│   ├── UserUpdated
│   ├── UserDeactivated
│   ├── RoleAssigned
│   └── LoginAttempt
│
└── Authentication Methods
    ├── JWT
    ├── OAuth 2.0
    └── Session tokens
```

**Key Features**:
- User registration and management
- Role-based access control (RBAC)
- Fine-grained permissions
- JWT token management
- Session management
- Audit logging

---

### Service Deployment Pattern

Each microservice follows this structure:

```
service-name/
├── src/
│   ├── main/
│   │   ├── java/com/mms/service/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── exception/
│   │   │   └── config/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/
│   └── test/
│       ├── java/com/mms/service/
│       └── resources/
├── Dockerfile
├── pom.xml
└── README.md
```

---

## Technology Stack

### Technology Layer Overview

```
┌────────────────────────────────────────────────────┐
│         Frontend Layer                              │
│  React 18 + TypeScript                             │
│  Redux/Zustand + Axios + Tailwind CSS              │
└────────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────────┐
│         API Gateway Layer                           │
│  Spring Cloud Gateway / Kong                       │
│  - Route Management                                 │
│  - Rate Limiting                                    │
│  - Authentication Filter                           │
└────────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────────┐
│         Backend Layer                               │
│  Java 17 + Spring Boot 3.x                         │
│  - Spring Data JPA                                 │
│  - Spring Security                                 │
│  - Spring Cloud                                    │
│  - Hibernate + Lombok                              │
└────────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────────┐
│         Message Layer                               │
│  RabbitMQ                                           │
│  - Event streaming                                 │
│  - Async processing                                │
│  - Service decoupling                              │
└────────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────────┐
│         Data Layer                                  │
│  PostgreSQL + Redis                                │
│  - Transactional data                              │
│  - Cache layer                                     │
│  - Operational reporting                           │
└────────────────────────────────────────────────────┘
```

### Detailed Technology Choices

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Frontend Framework** | React | 18+ | Component-based, large ecosystem, JSX syntax |
| **State Management** | Redux/Zustand | Latest | Predictable state, devtools support |
| **HTTP Client** | Axios | Latest | Promise-based, interceptors, error handling |
| **CSS Framework** | Tailwind CSS | v3 | Utility-first, responsive, customizable |
| **UI Library** | Material-UI | v5 | Comprehensive, accessibility, theming |
| **Backend Framework** | Spring Boot | 3.x | Enterprise-grade, extensive ecosystem |
| **ORM** | Hibernate | 6.x | JPA standard, performance, flexibility |
| **Build Tool** | Maven | 3.8+ | Dependency management, plugin ecosystem |
| **Service Discovery** | Spring Cloud Consul | Latest | Distributed config, health checks |
| **API Gateway** | Spring Cloud Gateway | Latest | Native Spring, route predicates |
| **Message Broker** | RabbitMQ | 3.10+ | Reliability, AMQP standard, management UI |
| **Primary Database** | PostgreSQL | 14+ | ACID, JSON support, extensibility |
| **Cache Store** | Redis | 6+ | In-memory, fast, persistence options |
| **Container Runtime** | Docker | 20+ | Isolation, portability, ecosystem |
| **Orchestration** | Kubernetes | 1.24+ | Service management, auto-scaling, self-healing |
| **Metrics** | Prometheus | Latest | Time-series DB, scrape-based, wide support |
| **Visualization** | Grafana | 8+ | Dashboard creation, alerting, datasource plugins |
| **Logging** | Structured logs | Latest | Centralized log collection and search |
| **Testing** | JUnit 5 + Mockito | Latest | Modern testing framework, mocking |
| **E2E Testing** | Cypress | Latest | Developer-friendly, time-travel debugging |

---

## Data Flow

### Order Creation Flow (Example)

```
User Browser
    ↓
    POST /api/v1/orders
    ↓
API Gateway
├─ Authentication ✓
├─ Rate Limiting ✓
└─ Route to Order Service
    ↓
Order Service
├─ Validate request
├─ Create Order entity
├─ Reserve inventory (call Inventory Service)
│   ↓ Inventory Service
│   ├─ Update stock levels
│   └─ Publish InventoryUpdated event
├─ Save to PostgreSQL
├─ Cache in Redis
├─ Publish OrderCreated event
│   ↓ Event (RabbitMQ)
│   ├─→ Notification Service (send confirmation)
│   ├─→ Analytics Service (aggregate metrics)
│   └─→ Warehouse Service (prepare picking)
└─ Return response with 201 Created

Response → Browser
```

### Inventory Update Flow

```
Order Fulfillment Trigger
    ↓
Warehouse Service processes picking
    ↓
Publishes OrderFulfilled event
    ↓
RabbitMQ broadcasts event
    ↓
├─→ Inventory Service
│   ├─ Reduce on-hand quantity
│   ├─ Update Redis cache
│   ├─ Trigger low-stock check
│   └─ Publish InventoryUpdated event
│
├─→ Analytics Service
│   ├─ Update inventory metrics
│   ├─ Calculate stock turns
│   └─ Update dashboard data
│
└─→ Notification Service
    ├─ Check if low-stock threshold exceeded
    └─ Send alert to stakeholders
```

---

## Communication Patterns

### Synchronous Communication (REST API)

```
Client
  ↓
API Gateway
  ↓
Service A ← → Service B (HTTP/REST)
  ↓
Response → Client
```

**Use Cases**:
- Real-time data retrieval
- User interactions
- Simple queries

**Example**:
```
GET /api/v1/materials/{id}
Material Service → calls Supplier Service
  → returns supplier details inline
```

---

### Asynchronous Communication (Event-Driven)

```
Service A → Event Bus (RabbitMQ) → Service B
                                → Service C
                                → Service D

(Services don't wait for response)
```

**Use Cases**:
- Notifications
- Analytics aggregation
- Triggering workflows
- Cross-service updates

**Example**:
```
OrderCreated event
  ↓
├─ Notification Service (email receipt)
├─ Inventory Service (adjust stock)
└─ Analytics Service (update metrics)
(All processing happens independently)
```

---

### Service-to-Service Communication

```
Service → Service Discovery (Consul)
  ↓
Get service location and health
  ↓
Call service with circuit breaker
  ↓
Handle errors with fallback
```

**Resilience Patterns**:
- Circuit Breaker: Fail fast when service down
- Retry with exponential backoff: Transient failures
- Timeout: Prevent hanging requests
- Fallback: Graceful degradation

---

## Deployment Architecture

### Local Development Environment

```
Docker Compose
├── API Gateway (port 8080)
├── Material Service (port 8001)
├── Inventory Service (port 8002)
├── Warehouse Service (port 8003)
├── Order Service (port 8004)
├── Supplier Service (port 8005)
├── Analytics Service (port 8006)
├── Notification Service (port 8007)
├── User Service (port 8008)
├── PostgreSQL (port 5432)
├── Redis (port 6379)
├── RabbitMQ (port 5672, UI: 15672)
└── React Dev Server (port 3000)
```

---

### Production Kubernetes Architecture

```
Kubernetes Cluster
├── Namespace: mms-prod
│   ├── Deployment: api-gateway (3 replicas)
│   ├── Deployment: material-service (3 replicas)
│   ├── Deployment: inventory-service (3 replicas)
│   ├── Deployment: warehouse-service (3 replicas)
│   ├── Deployment: order-service (3 replicas)
│   ├── Deployment: supplier-service (3 replicas)
│   ├── Deployment: analytics-service (2 replicas)
│   ├── Deployment: notification-service (2 replicas)
│   ├── Deployment: user-service (3 replicas)
│   ├── StatefulSet: PostgreSQL (1 primary + 2 replicas)
│   ├── StatefulSet: Redis (1 primary + 2 replicas)
│   └── StatefulSet: RabbitMQ (3 nodes cluster)
│
├── Services
│   ├── ClusterIP: Internal service discovery
│   ├── LoadBalancer: External API Gateway exposure
│   └── Ingress: HTTP(S) routing
│
├── ConfigMaps
│   ├── app-config
│   └── logging-config
│
├── Secrets
│   ├── db-credentials
│   ├── api-keys
│   └── jwt-secret
│
└── Monitoring & Logging
    ├── Prometheus ServiceMonitor
    ├── Grafana DataSource
    ├── Fluent Bit (log shipping)
    └── Application logs
```

---

### CI/CD Pipeline

```
Code Commit → GitHub
    ↓
GitHub Actions
├─ Build:
│  ├─ Maven build & tests
│  ├─ Docker image build
│  └─ Image push to registry
│
├─ Test:
│  ├─ Unit tests
│  ├─ Integration tests
│  └─ Security scanning
│
├─ Staging Deploy:
│  ├─ Helm deploy to staging
│  └─ E2E testing
│
└─ Production Deploy:
   ├─ Manual approval
   ├─ Blue-green deployment
   └─ Health checks
```

---

### Data Persistence

#### PostgreSQL
- Master-Replica replication
- Daily backups to S3
- Point-in-time recovery capability

#### Redis
- Primary/replica setup
- AOF persistence


#### RabbitMQ
- Clustered setup (3 nodes)
- Queue replication
- Persistent messages by default

---

**Document Version**: 1.0  
**Last Updated**: July 3, 2026  
**Status**: Complete
