package com.company.mms.stockmovement;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @Column(length = 50, updatable = false)
    private String id;

    @Column(name = "movement_type", length = 20, nullable = false, updatable = false)
    private String type;

    @Column(name = "material_id", length = 50, nullable = false, updatable = false)
    private String materialId;

    @Column(name = "warehouse_id", length = 50, nullable = false, updatable = false)
    private String warehouseId;

    @Column(precision = 15, scale = 2, nullable = false, updatable = false)
    private BigDecimal quantity;

    @Column(name = "reference_number", length = 100, nullable = false, updatable = false)
    private String referenceNumber;

    @Column(length = 500, updatable = false)
    private String notes;

    @Column(name = "processed_by", length = 100, nullable = false, updatable = false)
    private String processedBy;

    @Column(name = "movement_date", nullable = false, updatable = false)
    private LocalDate movementDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected StockMovement() {
    }

    public StockMovement(String id, String type, String materialId, String warehouseId,
            BigDecimal quantity, String referenceNumber, String notes, String processedBy,
            LocalDate movementDate) {
        this.id = id;
        this.type = type;
        this.materialId = materialId;
        this.warehouseId = warehouseId;
        this.quantity = quantity;
        this.referenceNumber = referenceNumber;
        this.notes = notes;
        this.processedBy = processedBy;
        this.movementDate = movementDate;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getMaterialId() {
        return materialId;
    }

    public String getWarehouseId() {
        return warehouseId;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public String getNotes() {
        return notes;
    }

    public String getProcessedBy() {
        return processedBy;
    }

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
