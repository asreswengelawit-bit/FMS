package com.company.fms.invoice;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @Column(name = "invoice_type", nullable = false, length = 20)
    private String invoiceType;

    @Column(name = "party_name", nullable = false)
    private String partyName;

    @Column(name = "period_id", nullable = false, length = 50)
    private String periodId;

    @Column(name = "period_name", length = 20)
    private String periodName;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "total_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal paidAmount;

    @Column(name = "remaining_balance", nullable = false, precision = 20, scale = 2)
    private BigDecimal remainingBalance;

    @Column(name = "control_account_id", length = 50)
    private String controlAccountId;

    @Column(name = "control_account_code", length = 50)
    private String controlAccountCode;

    @Column(name = "control_account_name", length = 255)
    private String controlAccountName;

    @Column(name = "vendor_id", length = 50)
    private String vendorId;

    @Column(name = "vendor_code", length = 50)
    private String vendorCode;

    @Column(name = "customer_id", length = 50)
    private String customerId;

    @Column(name = "customer_code", length = 50)
    private String customerCode;

    @Column(name = "journal_entry_id", length = 50)
    private String journalEntryId;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    private List<InvoiceLine> lines = new ArrayList<>();

    protected Invoice() {
    }

    public Invoice(String id, String invoiceNumber, String invoiceType, String partyName,
            String periodId, String periodName, LocalDate issueDate, LocalDate dueDate,
            String status, BigDecimal totalAmount, String controlAccountId, String controlAccountCode,
            String controlAccountName, String vendorId, String vendorCode, String customerId,
            String customerCode, String createdBy) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.invoiceType = invoiceType;
        this.partyName = partyName;
        this.periodId = periodId;
        this.periodName = periodName;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.paidAmount = BigDecimal.ZERO;
        this.remainingBalance = totalAmount;
        this.controlAccountId = controlAccountId;
        this.controlAccountCode = controlAccountCode;
        this.controlAccountName = controlAccountName;
        this.vendorId = vendorId;
        this.vendorCode = vendorCode;
        this.customerId = customerId;
        this.customerCode = customerCode;
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

    public void addLine(InvoiceLine line) {
        line.attachTo(this);
        lines.add(line);
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

    public void applyPayment(BigDecimal amount) {
        this.paidAmount = this.paidAmount.add(amount);
        this.remainingBalance = this.remainingBalance.subtract(amount);
        if (this.remainingBalance.signum() <= 0) {
            this.remainingBalance = BigDecimal.ZERO;
            this.status = "PAID";
        } else {
            this.status = "PARTIALLY_PAID";
        }
    }

    public String getId() { return id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public String getInvoiceType() { return invoiceType; }
    public String getPartyName() { return partyName; }
    public String getPeriodId() { return periodId; }
    public String getPeriodName() { return periodName; }
    public LocalDate getIssueDate() { return issueDate; }
    public LocalDate getDueDate() { return dueDate; }
    public String getStatus() { return status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public BigDecimal getRemainingBalance() { return remainingBalance; }
    public String getControlAccountId() { return controlAccountId; }
    public String getControlAccountCode() { return controlAccountCode; }
    public String getControlAccountName() { return controlAccountName; }
    public String getVendorId() { return vendorId; }
    public String getVendorCode() { return vendorCode; }
    public String getCustomerId() { return customerId; }
    public String getCustomerCode() { return customerCode; }
    public String getJournalEntryId() { return journalEntryId; }
    public String getCreatedBy() { return createdBy; }
    public String getApprovedBy() { return approvedBy; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<InvoiceLine> getLines() { return lines; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
}
