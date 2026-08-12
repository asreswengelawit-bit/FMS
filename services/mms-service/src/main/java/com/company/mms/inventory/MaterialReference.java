package com.company.mms.inventory;

import java.math.BigDecimal;

import org.hibernate.annotations.Immutable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity(name = "InventoryMaterialReference")
@Table(name = "materials")
@Immutable
public class MaterialReference {

    @Id
    @Column(length = 50)
    private String id;

    @Column(length = 200, nullable = false)
    private String name;

    @Column(name = "unit_of_measure", length = 30, nullable = false)
    private String unitOfMeasure;

    @Column(name = "unit_cost", precision = 15, scale = 2, nullable = false)
    private BigDecimal unitCost;

    @Column(name = "reorder_level", precision = 15, scale = 2, nullable = false)
    private BigDecimal reorderLevel;

    @Column(nullable = false)
    private boolean active;

    protected MaterialReference() {
    }

    public MaterialReference(String id, String name, String unitOfMeasure, BigDecimal unitCost, BigDecimal reorderLevel, boolean active) {
        this.id = id;
        this.name = name;
        this.unitOfMeasure = unitOfMeasure;
        this.unitCost = unitCost;
        this.reorderLevel = reorderLevel;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
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
}
