package com.company.mms.goodsreceipt;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "goods_receipts")
public class GoodsReceipt {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "purchase_order_reference", length = 100, nullable = false)
    private String purchaseOrderReference;

    @Column(name = "warehouse_id", length = 50, nullable = false)
    private String warehouseId;

    @Column(name = "receipt_date", nullable = false)
    private LocalDate receiptDate;

    @Column(name = "received_by", length = 100, nullable = false)
    private String receivedBy;

    @Column(length = 30, nullable = false)
    private String status = "RECEIVED";

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "goodsReceipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GoodsReceiptLine> lines = new ArrayList<>();

    protected GoodsReceipt() {
    }

    public GoodsReceipt(String id, String purchaseOrderReference, String warehouseId,
            LocalDate receiptDate, String receivedBy, String notes) {
        this.id = id;
        this.purchaseOrderReference = purchaseOrderReference;
        this.warehouseId = warehouseId;
        this.receiptDate = receiptDate == null ? LocalDate.now() : receiptDate;
        this.receivedBy = receivedBy;
        this.notes = notes;
    }

    public void addLine(GoodsReceiptLine line) {
        line.setGoodsReceipt(this);
        this.lines.add(line);
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public String getId() {
        return id;
    }

    public String getPurchaseOrderReference() {
        return purchaseOrderReference;
    }

    public String getWarehouseId() {
        return warehouseId;
    }

    public LocalDate getReceiptDate() {
        return receiptDate;
    }

    public String getReceivedBy() {
        return receivedBy;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<GoodsReceiptLine> getLines() {
        return lines;
    }
}
