package com.company.mms.item;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "materials")
public class Material {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String category;

    @Column(name = "unit_of_measure", length = 30, nullable = false)
    private String unitOfMeasure;

    @Column(name = "unit_cost", precision = 15, scale = 2, nullable = false)
    private BigDecimal unitCost;

    @Column(name = "reorder_level", precision = 15, scale = 2, nullable = false)
    private BigDecimal reorderLevel;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Material() {
    }

    public Material(String id, String name, String category, String unitOfMeasure,
            BigDecimal unitCost, BigDecimal reorderLevel, boolean active) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.unitOfMeasure = unitOfMeasure;
        this.unitCost = unitCost;
        this.reorderLevel = reorderLevel;
        this.active = active;
    }

    public void update(String name, String category, String unitOfMeasure,
            BigDecimal unitCost, BigDecimal reorderLevel, Boolean active) {
        if (name != null && !name.isBlank()) this.name = name;
        if (category != null && !category.isBlank()) this.category = category;
        if (unitOfMeasure != null && !unitOfMeasure.isBlank()) this.unitOfMeasure = unitOfMeasure;
        if (unitCost != null) this.unitCost = unitCost;
        if (reorderLevel != null) this.reorderLevel = reorderLevel;
        if (active != null) this.active = active;
    }

    public void deactivate() {
        this.active = false;
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

    public String getCategory() {
        return category;
    }

    public String getUnitOfMeasure() {
        return unitOfMeasure;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public BigDecimal getReorderLevel() {
        return reorderLevel;
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
