package com.company.mms.requisition;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "requisitions")
public class Requisition {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "requested_by", length = 100, nullable = false)
    private String requestedBy;

    @Column(length = 100, nullable = false)
    private String department;

    @Column(name = "material_id", length = 50, nullable = false)
    private String materialId;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal quantity;

    @Column(name = "required_date", nullable = false)
    private LocalDate requiredDate;

    @Column(length = 20, nullable = false)
    private String priority = "Normal";

    @Column(length = 30, nullable = false)
    private String status = "PENDING";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Requisition() {
    }

    public Requisition(String id, String requestedBy, String department, String materialId,
            BigDecimal quantity, LocalDate requiredDate, String priority, String status) {
        this.id = id;
        this.requestedBy = requestedBy;
        this.department = department;
        this.materialId = materialId;
        this.quantity = quantity;
        this.requiredDate = requiredDate == null ? LocalDate.now() : requiredDate;
        this.priority = priority == null || priority.isBlank() ? "Normal" : priority;
        this.status = status == null || status.isBlank() ? "PENDING" : status;
    }

    public void approve() {
        this.status = "APPROVED";
    }

    public void issue() {
        this.status = "Issued";
    }

    public void reject() {
        this.status = "Rejected";
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

    public String getRequestedBy() {
        return requestedBy;
    }

    public String getDepartment() {
        return department;
    }

    public String getMaterialId() {
        return materialId;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public LocalDate getRequiredDate() {
        return requiredDate;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
