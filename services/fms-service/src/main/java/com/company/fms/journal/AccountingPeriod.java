package com.company.fms.journal;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "accounting_periods")
public class AccountingPeriod {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "period_name", nullable = false, unique = true, length = 20)
    private String periodName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "opened_by", length = 100)
    private String openedBy;

    @Column(name = "closed_by", length = 100)
    private String closedBy;

    @Column(name = "opened_at", nullable = false, updatable = false)
    private Instant openedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    protected AccountingPeriod() {
    }

    public AccountingPeriod(String id, String periodName, LocalDate startDate, LocalDate endDate,
            String status, String openedBy) {
        this.id = id;
        this.periodName = periodName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.openedBy = openedBy;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        if (openedAt == null) {
            openedAt = now;
        }
        if (createdAt == null) {
            createdAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void softClose() {
        this.status = "SOFT_CLOSED";
    }

    public void close(String closedBy) {
        this.status = "CLOSED";
        this.closedBy = closedBy;
        this.closedAt = Instant.now();
    }

    public void reopen() {
        this.status = "OPEN";
        this.closedBy = null;
        this.closedAt = null;
    }

    public boolean isOpen() {
        return "OPEN".equals(status);
    }

    public String getId() { return id; }
    public String getPeriodName() { return periodName; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getStatus() { return status; }
    public String getOpenedBy() { return openedBy; }
    public String getClosedBy() { return closedBy; }
    public Instant getOpenedAt() { return openedAt; }
    public Instant getClosedAt() { return closedAt; }
}
