package com.company.fms.journal;

import java.math.BigDecimal;
import java.time.Instant;
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
@Table(name = "journal_entries")
public class JournalEntry {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "period_id", nullable = false, length = 50)
    private String periodId;

    @Column(name = "period_name", length = 20)
    private String periodName;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "posted_at")
    private Instant postedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "total_debit", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalDebit;

    @Column(name = "total_credit", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalCredit;

    @Column(name = "reversal_of_journal_id", length = 50)
    private String reversalOfJournalId;

    @Column(name = "is_reversal", nullable = false)
    private boolean reversal;

    @OneToMany(mappedBy = "journal", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    private List<JournalLine> lines = new ArrayList<>();

    protected JournalEntry() {
    }

    public JournalEntry(String id, String periodId, String periodName, String description,
            String status, String createdBy) {
        this.id = id;
        this.periodId = periodId;
        this.periodName = periodName;
        this.description = description;
        this.status = status;
        this.createdBy = createdBy;
        this.totalDebit = BigDecimal.ZERO;
        this.totalCredit = BigDecimal.ZERO;
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

    public void addLine(JournalLine line) {
        line.attachTo(this);
        lines.add(line);
    }

    public void recalcTotals() {
        totalDebit = lines.stream().map(JournalLine::getDebitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        totalCredit = lines.stream().map(JournalLine::getCreditAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public boolean isBalanced() {
        return totalDebit.compareTo(totalCredit) == 0;
    }

    public void submit() {
        this.status = "SUBMITTED";
    }

    public void approve(String approvedBy) {
        this.status = "APPROVED";
        this.approvedBy = approvedBy;
    }

    public void post() {
        this.status = "POSTED";
        this.postedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getPeriodId() { return periodId; }
    public String getPeriodName() { return periodName; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getCreatedBy() { return createdBy; }
    public String getApprovedBy() { return approvedBy; }
    public Instant getPostedAt() { return postedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public BigDecimal getTotalDebit() { return totalDebit; }
    public BigDecimal getTotalCredit() { return totalCredit; }
    public String getReversalOfJournalId() { return reversalOfJournalId; }
    public boolean isReversal() { return reversal; }
    public List<JournalLine> getLines() { return lines; }

    public void setDescription(String description) { this.description = description; }
    public void setReversalOfJournalId(String reversalOfJournalId) { this.reversalOfJournalId = reversalOfJournalId; }
    public void setReversal(boolean reversal) { this.reversal = reversal; }
    public void setPeriodId(String periodId) { this.periodId = periodId; }
    public void setPeriodName(String periodName) { this.periodName = periodName; }
}
