package com.company.fms.payment;

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
@Table(name = "payments")
public class Payment {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "payment_number", nullable = false, unique = true)
    private String paymentNumber;

    @Column(name = "payment_type", nullable = false, length = 20)
    private String paymentType;

    @Column(name = "party_name")
    private String partyName;

    @Column(name = "period_id", nullable = false, length = 50)
    private String periodId;

    @Column(name = "period_name", length = 20)
    private String periodName;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(nullable = false, precision = 20, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "control_account_id", length = 50)
    private String controlAccountId;

    @Column(name = "control_account_code", length = 50)
    private String controlAccountCode;

    @Column(name = "control_account_name", length = 255)
    private String controlAccountName;

    @Column(name = "invoice_id", length = 50)
    private String invoiceId;

    @Column(name = "invoice_number", length = 100)
    private String invoiceNumber;

    @Column(name = "journal_entry_id", length = 50)
    private String journalEntryId;

    @Column(name = "related_entity_id", length = 50)
    private String relatedEntityId;

    @Column(name = "related_entity_code", length = 50)
    private String relatedEntityCode;

    @Column(length = 500)
    private String notes;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    protected Payment() {
    }

    public Payment(String id, String paymentNumber, String paymentType, String partyName,
            String periodId, String periodName, LocalDate paymentDate, BigDecimal amount,
            String paymentMethod, String referenceNumber, String controlAccountId,
            String controlAccountCode, String controlAccountName, String invoiceId,
            String invoiceNumber, String notes, String createdBy) {
        this.id = id;
        this.paymentNumber = paymentNumber;
        this.paymentType = paymentType;
        this.partyName = partyName;
        this.periodId = periodId;
        this.periodName = periodName;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.status = "DRAFT";
        this.paymentMethod = paymentMethod;
        this.referenceNumber = referenceNumber;
        this.controlAccountId = controlAccountId;
        this.controlAccountCode = controlAccountCode;
        this.controlAccountName = controlAccountName;
        this.invoiceId = invoiceId;
        this.invoiceNumber = invoiceNumber;
        this.notes = notes;
        this.createdBy = createdBy;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void submit() {
        this.status = "SUBMITTED";
    }

    public void approve(String approvedBy) {
        this.status = "APPROVED";
        this.approvedBy = approvedBy;
    }

    public void post(String journalEntryId) {
        this.status = "POSTED";
        this.journalEntryId = journalEntryId;
    }

    public String getId() { return id; }
    public String getPaymentNumber() { return paymentNumber; }
    public String getPaymentType() { return paymentType; }
    public String getPartyName() { return partyName; }
    public String getPeriodId() { return periodId; }
    public String getPeriodName() { return periodName; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public BigDecimal getAmount() { return amount; }
    public String getStatus() { return status; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getReferenceNumber() { return referenceNumber; }
    public String getControlAccountId() { return controlAccountId; }
    public String getControlAccountCode() { return controlAccountCode; }
    public String getControlAccountName() { return controlAccountName; }
    public String getInvoiceId() { return invoiceId; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public String getJournalEntryId() { return journalEntryId; }
    public String getRelatedEntityId() { return relatedEntityId; }
    public String getRelatedEntityCode() { return relatedEntityCode; }
    public String getNotes() { return notes; }
    public String getCreatedBy() { return createdBy; }
    public String getApprovedBy() { return approvedBy; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setRelatedEntityId(String relatedEntityId) { this.relatedEntityId = relatedEntityId; }
    public void setRelatedEntityCode(String relatedEntityCode) { this.relatedEntityCode = relatedEntityCode; }
}
