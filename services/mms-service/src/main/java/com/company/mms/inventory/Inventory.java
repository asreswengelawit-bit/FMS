package com.company.mms.inventory;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "material_id", length = 50, nullable = false, updatable = false)
    private String materialId;

    @Column(name = "warehouse_id", length = 50, nullable = false, updatable = false)
    private String warehouseId;

    @Column(name = "on_hand", precision = 15, scale = 2, nullable = false)
    private BigDecimal onHand = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal reserved = BigDecimal.ZERO;

    @Version
    @Column(nullable = false)
    private long version;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Inventory() {
    }

    public Inventory(String materialId, String warehouseId) {
        this.materialId = materialId;
        this.warehouseId = warehouseId;
    }

    public void adjustOnHand(BigDecimal quantity) {
        onHand = onHand.add(quantity);
    }

    public void reserve(BigDecimal quantity) {
        reserved = reserved.add(quantity);
    }

    public void release(BigDecimal quantity) {
        reserved = reserved.subtract(quantity);
    }

    public BigDecimal available() {
        return onHand.subtract(reserved);
    }

    @PrePersist
    @PreUpdate
    void updateTimestamp() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getMaterialId() {
        return materialId;
    }

    public String getWarehouseId() {
        return warehouseId;
    }

    public BigDecimal getOnHand() {
        return onHand;
    }

    public BigDecimal getReserved() {
        return reserved;
    }

    public long getVersion() {
        return version;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
