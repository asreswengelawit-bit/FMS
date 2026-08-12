package com.company.mms.warehouse;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 255, nullable = false)
    private String location;

    @Column(name = "warehouse_type", length = 50, nullable = false)
    private String type;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal capacity;

    @Column(name = "manager_name", length = 200)
    private String manager;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Warehouse() {
    }

    public Warehouse(String id, String name, String location, String type, BigDecimal capacity,
            String manager, boolean active) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.type = type;
        this.capacity = capacity;
        this.manager = manager;
        this.active = active;
    }

    public void update(String name, String location, String type, BigDecimal capacity,
            String manager, Boolean active) {
        this.name = name;
        this.location = location;
        this.type = type;
        this.capacity = capacity;
        this.manager = manager;
        if (active != null) {
            this.active = active;
        }
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getCapacity() {
        return capacity;
    }

    public String getManager() {
        return manager;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
