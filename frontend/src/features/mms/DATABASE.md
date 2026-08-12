# Material Management System (MMS) - Database Documentation

## Overview

This document provides comprehensive information about the MMS database architecture, schema design, and best practices.

---

## Table of Contents

1. [Database Architecture](#database-architecture)
2. [Schema Overview](#schema-overview)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Core Tables](#core-tables)
5. [Indexing Strategy](#indexing-strategy)
6. [Data Types](#data-types)
7. [Constraints & Validations](#constraints--validations)
8. [Partitioning Strategy](#partitioning-strategy)
9. [Backup & Recovery](#backup--recovery)
10. [Performance Optimization](#performance-optimization)

---

## Database Architecture

### Multi-Database Strategy

The MMS uses a polyglot persistence approach:

| Database | Purpose | Tables |
|----------|---------|--------|
| **PostgreSQL** | Primary OLTP database | Most transactional tables |
| **Redis** | Cache & Sessions | Temporary data |

### Database Selection Rationale

**PostgreSQL**:
- ACID compliance for transactional consistency
- JSON/JSONB support for flexible schemas
- Advanced features (full-text search, arrays, ranges)
- Proven reliability at enterprise scale
- Excellent for relational data

**Redis**:
- In-memory caching for performance
- Session storage
- Real-time data aggregation

---

## Schema Overview

### Database Naming Conventions

- **Table names**: snake_case, plural (e.g., `materials`, `order_items`)
- **Column names**: snake_case (e.g., `created_at`, `unit_cost`)
- **Constraints**: `pk_table`, `fk_table_column`, `uq_table_column`
- **Indexes**: `idx_table_column`

### Logical Schema Groups

```
Core Master Data
├── materials
├── suppliers
├── warehouses
├── locations
└── users

Inventory Management
├── inventory
├── inventory_movements
└── inventory_reservations

Order Management
├── orders
├── order_items
└── order_receipts

Analytics & Audit
├── audit_logs
├── inventory_snapshots
└── supplier_performance

System
├── roles
├── permissions
└── user_roles
```

---

## Entity Relationship Diagram

```
                          ┌─────────────┐
                          │  Suppliers  │
                          └──────┬──────┘
                                 │ 1
                    ┌────────────┼────────────┐
                    │            │            │
                    │ N          │ N          │ N
                ┌───┴───┐   ┌────┴────┐  ┌───┴────┐
                │        │   │         │  │        │
            Materials  Orders     Contracts   Contacts
                │        │
                │ 1      │ 1
                │        │
           ┌────┴─────┬──┴──────┐
           │          │         │
           │ N        │ N       │
       Inventory  OrderItems    │
           │          │         │
           │ 1        │ 1       │
       ┌───┴──┐   ┌────┴─────┐  │
       │      │   │          │  │
    Warehouses  Locations     └──┘
       │      │
       │ N    │ N
       │      └─────────────────┐
       │                         │
    Zones                 InventoryMovements
       │
       │ 1
       └─────────────────────┐
                             │
                        Locations
```

---

## Core Tables

### Materials Table

**Purpose**: Master data for all materials/SKUs

```sql
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES material_categories(id),
    unit_of_measure VARCHAR(20) NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    unit_cost DECIMAL(10, 2) NOT NULL CHECK (unit_cost >= 0),
    safety_stock INTEGER NOT NULL DEFAULT 0 CHECK (safety_stock >= 0),
    lead_time_days INTEGER NOT NULL DEFAULT 7 CHECK (lead_time_days >= 0),
    reorder_quantity INTEGER NOT NULL DEFAULT 100 CHECK (reorder_quantity > 0),
    is_active BOOLEAN DEFAULT true,
    is_hazmat BOOLEAN DEFAULT false,
    storage_location VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT DEFAULT 0,
    
    -- Constraints
    CONSTRAINT ck_material_cost_positive CHECK (unit_cost > 0),
    CONSTRAINT ck_material_lead_time CHECK (lead_time_days > 0)
);

-- Indexes
CREATE INDEX idx_materials_sku ON materials(sku);
CREATE INDEX idx_materials_supplier_id ON materials(supplier_id);
CREATE INDEX idx_materials_category_id ON materials(category_id);
CREATE INDEX idx_materials_is_active ON materials(is_active);
CREATE INDEX idx_materials_created_at ON materials(created_at);

-- Full-text search index
CREATE INDEX idx_materials_full_text 
    ON materials USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### Inventory Table

**Purpose**: Real-time inventory tracking by warehouse and location

```sql
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_reserved INTEGER NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    quantity_in_transit INTEGER NOT NULL DEFAULT 0 CHECK (quantity_in_transit >= 0),
    quantity_available_for_sale INTEGER GENERATED ALWAYS AS 
        (quantity_on_hand - quantity_reserved) STORED,
    reorder_point INTEGER NOT NULL DEFAULT 100,
    reorder_quantity INTEGER NOT NULL DEFAULT 100,
    last_counted_at TIMESTAMP,
    last_movement_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_counted_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    
    -- Constraint: unique per material and warehouse
    UNIQUE(material_id, warehouse_id),
    
    -- Check constraints
    CONSTRAINT ck_inventory_qty_reserved CHECK (
        quantity_reserved <= quantity_on_hand
    )
);

-- Indexes
CREATE INDEX idx_inventory_material_id ON inventory(material_id);
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);
CREATE INDEX idx_inventory_location_id ON inventory(location_id);
CREATE INDEX idx_inventory_low_stock 
    ON inventory(material_id, warehouse_id) 
    WHERE quantity_available_for_sale < reorder_point;
CREATE INDEX idx_inventory_updated_at ON inventory(updated_at DESC);
```

### Inventory Movements Table

**Purpose**: Complete audit trail of inventory changes

```sql
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    movement_type VARCHAR(20) NOT NULL, 
    -- RECEIPT, ISSUE, ADJUSTMENT, TRANSFER, RETURN
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20), 
    -- ORDER, TRANSFER, PHYSICAL_COUNT, RETURN, DAMAGE
    reference_id VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    
    -- Constraints
    CONSTRAINT ck_movement_type CHECK (
        movement_type IN ('RECEIPT', 'ISSUE', 'ADJUSTMENT', 'TRANSFER', 'RETURN')
    ),
    CONSTRAINT ck_movement_qty CHECK (
        (movement_type IN ('RECEIPT', 'TRANSFER', 'RETURN') AND quantity > 0) OR
        (movement_type IN ('ISSUE', 'ADJUSTMENT') AND quantity != 0)
    )
);

-- Indexes for performance
CREATE INDEX idx_inventory_movements_inventory_id 
    ON inventory_movements(inventory_id);
CREATE INDEX idx_inventory_movements_material_id 
    ON inventory_movements(material_id);
CREATE INDEX idx_inventory_movements_warehouse_id 
    ON inventory_movements(warehouse_id);
CREATE INDEX idx_inventory_movements_created_at 
    ON inventory_movements(created_at DESC);
CREATE INDEX idx_inventory_movements_ref_id 
    ON inventory_movements(reference_type, reference_id);

-- Partitioning by date
CREATE TABLE inventory_movements_2026_q1 
    PARTITION OF inventory_movements
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
CREATE TABLE inventory_movements_2026_q2 
    PARTITION OF inventory_movements
    FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');
CREATE TABLE inventory_movements_2026_q3 
    PARTITION OF inventory_movements
    FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');
CREATE TABLE inventory_movements_2026_q4 
    PARTITION OF inventory_movements
    FOR VALUES FROM ('2026-10-01') TO ('2027-01-01');
```

### Orders Table

**Purpose**: Purchase and sales orders

```sql
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    order_type VARCHAR(20) NOT NULL, -- PO, SO
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    -- DRAFT, SUBMITTED, CONFIRMED, PARTIAL, RECEIVED, CANCELLED
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL,
    updated_by VARCHAR(100),
    version BIGINT DEFAULT 0,
    
    -- Constraints
    CONSTRAINT ck_order_type CHECK (order_type IN ('PO', 'SO')),
    CONSTRAINT ck_order_status CHECK (
        status IN ('DRAFT', 'SUBMITTED', 'CONFIRMED', 'PARTIAL', 'RECEIVED', 'CANCELLED')
    ),
    CONSTRAINT ck_order_amount CHECK (total_amount >= 0),
    CONSTRAINT ck_order_dates CHECK (
        expected_delivery_date IS NULL OR 
        expected_delivery_date >= order_date
    )
);

-- Indexes
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Partition orders by date for historical data
CREATE TABLE orders PARTITION BY RANGE (order_date);
```

### Order Items Table

**Purpose**: Individual line items in orders

```sql
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
    quantity_ordered INTEGER NOT NULL CHECK (quantity_ordered > 0),
    quantity_received INTEGER NOT NULL DEFAULT 0 CHECK (quantity_received >= 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
    line_total DECIMAL(15, 2) GENERATED ALWAYS AS 
        (quantity_ordered * unit_price) STORED,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    location_id UUID REFERENCES locations(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    -- PENDING, PARTIAL, RECEIVED, CANCELLED
    expected_delivery_date DATE,
    actual_receipt_date DATE,
    inspection_status VARCHAR(20),
    -- PENDING, ACCEPTED, REJECTED, QUARANTINE
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT ck_qty_received CHECK (quantity_received <= quantity_ordered)
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_material_id ON order_items(material_id);
CREATE INDEX idx_order_items_warehouse_id ON order_items(warehouse_id);
CREATE INDEX idx_order_items_status ON order_items(status);
```

### Warehouses Table

**Purpose**: Physical warehouse locations

```sql
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address_street VARCHAR(255),
    address_city VARCHAR(100) NOT NULL,
    address_state VARCHAR(100),
    address_country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_capacity INTEGER NOT NULL,
    available_capacity INTEGER GENERATED ALWAYS AS 
        (total_capacity - used_capacity) STORED,
    used_capacity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    manager_id UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT ck_warehouse_capacity CHECK (total_capacity > 0),
    CONSTRAINT ck_warehouse_used_capacity CHECK (
        used_capacity >= 0 AND used_capacity <= total_capacity
    )
);

-- Indexes
CREATE INDEX idx_warehouses_code ON warehouses(code);
CREATE INDEX idx_warehouses_is_active ON warehouses(is_active);
CREATE INDEX idx_warehouses_city ON warehouses(address_city);
```

### Locations Table

**Purpose**: Storage locations within warehouses

```sql
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    aisle VARCHAR(10) NOT NULL,
    rack VARCHAR(10) NOT NULL,
    bin VARCHAR(10) NOT NULL,
    level VARCHAR(5),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    used_capacity INTEGER DEFAULT 0 CHECK (used_capacity >= 0),
    is_available BOOLEAN DEFAULT true,
    location_type VARCHAR(20), -- SHELF, BIN, PALLET, RACKING
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint
    UNIQUE(warehouse_id, aisle, rack, bin, level),
    
    -- Check constraint
    CONSTRAINT ck_location_capacity CHECK (used_capacity <= capacity)
);

-- Indexes
CREATE INDEX idx_locations_warehouse_id ON locations(warehouse_id);
CREATE INDEX idx_locations_zone_id ON locations(zone_id);
CREATE INDEX idx_locations_aisle_rack 
    ON locations(warehouse_id, aisle, rack);
CREATE INDEX idx_locations_available 
    ON locations(warehouse_id) WHERE is_available = true;
```

### Suppliers Table

**Purpose**: Supplier master data

```sql
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    fax VARCHAR(20),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100),
    postal_code VARCHAR(20),
    payment_terms VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    -- ACTIVE, INACTIVE, BLOCKED, PROBATION
    rating DECIMAL(3, 1),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(15, 2) DEFAULT 0,
    average_lead_time_days INTEGER,
    quality_score DECIMAL(5, 2),
    on_time_delivery_rate DECIMAL(5, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT ck_supplier_status CHECK (
        status IN ('ACTIVE', 'INACTIVE', 'BLOCKED', 'PROBATION')
    ),
    CONSTRAINT ck_supplier_rating CHECK (
        rating >= 0 AND rating <= 5
    )
);

-- Indexes
CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_rating ON suppliers(rating DESC);
```

### Users Table

**Purpose**: User accounts and authentication

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    department VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    -- ACTIVE, INACTIVE, LOCKED, SUSPENDED
    last_login TIMESTAMP,
    last_password_change TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT ck_user_status CHECK (
        status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED')
    )
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

---

## Indexing Strategy

### Index Types by Use Case

**Foreign Key Indexes**:
```sql
CREATE INDEX idx_inventory_material_id ON inventory(material_id);
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

**Search & Filter Indexes**:
```sql
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_materials_sku ON materials(sku);
CREATE INDEX idx_suppliers_code ON suppliers(code);
```

**Range Scan Indexes** (Date/Time):
```sql
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_inventory_movements_created_at 
    ON inventory_movements(created_at DESC);
```

**Composite Indexes** (Multiple columns):
```sql
CREATE INDEX idx_inventory_movement_lookup 
    ON inventory_movements(material_id, warehouse_id, created_at DESC);
CREATE INDEX idx_locations_lookup 
    ON locations(warehouse_id, aisle, rack);
```

**Full-Text Search Indexes**:
```sql
CREATE INDEX idx_materials_search 
    ON materials USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

**Partial Indexes** (for filtered queries):
```sql
CREATE INDEX idx_inventory_low_stock 
    ON inventory(material_id, warehouse_id) 
    WHERE quantity_available_for_sale < reorder_point;

CREATE INDEX idx_orders_pending 
    ON orders(created_at DESC) 
    WHERE status IN ('DRAFT', 'SUBMITTED', 'PARTIAL');
```

### Index Maintenance

```sql
-- Analyze tables for query planner
ANALYZE materials;
ANALYZE inventory;
ANALYZE orders;

-- Monitor index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT schemaname, tablename, indexname 
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
AND indexrelname NOT LIKE 'pg_toast%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Data Types

### Common PostgreSQL Data Types

| Data Type | Usage | Example |
|-----------|-------|---------|
| `UUID` | Primary keys | `DEFAULT gen_random_uuid()` |
| `VARCHAR(n)` | Short strings | Names, codes, SKUs |
| `TEXT` | Long text | Descriptions, notes |
| `INTEGER` | Whole numbers | Quantities, counts |
| `DECIMAL(p,s)` | Monetary values | Prices, costs |
| `BOOLEAN` | True/False | Flags, statuses |
| `TIMESTAMP` | Date and time | Audit timestamps |
| `DATE` | Just date | Order dates |
| `JSONB` | JSON documents | Flexible attributes |
| `ARRAY` | Lists | Tags, categories |

### Material-Specific Types

**Unit of Measure**:
```sql
CREATE TYPE unit_of_measure AS ENUM (
    'PCS',      -- Pieces
    'KG',       -- Kilograms
    'LTR',      -- Liters
    'MTR',      -- Meters
    'BOX',      -- Boxes
    'CASE',     -- Cases
    'PACK'      -- Packages
);

ALTER TABLE materials 
    ALTER COLUMN unit_of_measure TYPE unit_of_measure;
```

---

## Constraints & Validations

### Primary Key Constraints

All tables have UUID primary keys for distributed systems:
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

### Foreign Key Constraints

```sql
-- RESTRICT: Prevent deletion if referenced
supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT

-- CASCADE: Delete dependent records
order_id UUID REFERENCES orders(id) ON DELETE CASCADE

-- SET NULL: Clear reference on deletion
location_id UUID REFERENCES locations(id) ON DELETE SET NULL
```

### Unique Constraints

```sql
-- Business key
UNIQUE(sku)

-- Composite unique key
UNIQUE(material_id, warehouse_id)

-- Multi-column unique
UNIQUE(warehouse_id, aisle, rack, bin, level)
```

### Check Constraints

```sql
-- Value ranges
CHECK (unit_cost > 0)
CHECK (quantity_on_hand >= 0)
CHECK (safety_stock >= 0)

-- Business logic
CHECK (quantity_reserved <= quantity_on_hand)
CHECK (expected_delivery_date >= order_date)
CHECK (rating >= 0 AND rating <= 5)

-- Enum values
CHECK (order_type IN ('PO', 'SO'))
CHECK (status IN ('DRAFT', 'SUBMITTED', 'CONFIRMED', 'CANCELLED'))
```

### NOT NULL Constraints

```sql
-- Critical fields
name VARCHAR(255) NOT NULL
quantity_ordered INTEGER NOT NULL
order_date DATE NOT NULL
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

---

## Partitioning Strategy

### Time-Based Partitioning

Partition large tables by date to improve performance:

```sql
-- Create partitioned table
CREATE TABLE inventory_movements (
    -- columns...
) PARTITION BY RANGE (created_at);

-- Create quarterly partitions
CREATE TABLE inventory_movements_2026_q1 
    PARTITION OF inventory_movements
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

CREATE TABLE inventory_movements_2026_q2 
    PARTITION OF inventory_movements
    FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

-- Auto-create new partitions
CREATE TABLE inventory_movements_2026_q3 
    PARTITION OF inventory_movements
    FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');
```

### Benefits of Partitioning

- Faster queries on date ranges
- Easier maintenance and archival
- Better I/O performance
- Enables parallel query execution

---

## Backup & Recovery

### Backup Strategy

```bash
# Full backup
pg_dump -h localhost -U mms_user -d mms > backup_full_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -h localhost -U mms_user -d mms | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Custom format (faster restore)
pg_dump -h localhost -U mms_user -d mms -Fc > backup_$(date +%Y%m%d_%H%M%S).dump

# Incremental WAL backup
pg_basebackup -h localhost -U mms_user -D /backup/mms -v -P
```

### Recovery Procedures

```bash
# Restore from SQL dump
psql -U mms_user mms < backup_full_20260703_000000.sql

# Restore from compressed backup
gunzip -c backup_20260703_000000.sql.gz | psql -U mms_user mms

# Restore from custom format
pg_restore -U mms_user -d mms backup_20260703_000000.dump
```

### Point-in-Time Recovery (PITR)

```bash
# Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /archive/%f'

# Restore to specific point in time
pg_restore -U mms_user -d mms --recovery-target-time='2026-07-03 10:30:00' backup.dump
```

---

## Performance Optimization

### Query Performance Tips

**1. Use EXPLAIN ANALYZE**:
```sql
EXPLAIN ANALYZE
SELECT * FROM inventory 
WHERE material_id = 'mat-001' 
AND warehouse_id = 'wh-001';
```

**2. Avoid SELECT ***:
```sql
-- Bad
SELECT * FROM inventory;

-- Good
SELECT id, material_id, warehouse_id, quantity_on_hand 
FROM inventory;
```

**3. Use Appropriate JOIN Types**:
```sql
-- INNER JOIN: Only matching records
SELECT o.order_number, oi.quantity, m.name
FROM orders o
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN materials m ON oi.material_id = m.id;

-- LEFT JOIN: All from left table
SELECT w.name, COUNT(i.id) as material_count
FROM warehouses w
LEFT JOIN inventory i ON w.id = i.warehouse_id
GROUP BY w.id;
```

**4. Use LIMIT for large result sets**:
```sql
SELECT * FROM inventory 
ORDER BY updated_at DESC 
LIMIT 100;
```

**5. Batch Operations**:
```sql
-- Bulk insert
INSERT INTO inventory_movements (inventory_id, material_id, quantity, created_by)
VALUES 
    ('inv-001', 'mat-001', 10, 'user1'),
    ('inv-002', 'mat-002', 20, 'user1'),
    ('inv-003', 'mat-003', 30, 'user1');
```

### Connection Pooling

Configure HikariCP in Spring Boot:

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      auto-commit: true
```

### Caching Strategy

```sql
-- Cache frequently accessed materials
SELECT id, sku, name, unit_cost, safety_stock 
FROM materials 
WHERE is_active = true;
-- TTL: 1 hour in Redis

-- Cache inventory snapshots
SELECT material_id, warehouse_id, quantity_on_hand 
FROM inventory;
-- TTL: 15 minutes in Redis
```

---

**Document Version**: 1.0  
**Last Updated**: July 3, 2026  
**Status**: Complete
