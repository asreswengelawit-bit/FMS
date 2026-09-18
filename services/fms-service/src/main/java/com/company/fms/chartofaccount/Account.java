package com.company.fms.chartofaccount;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "coa_accounts")
public class Account {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "normal_balance", nullable = false, length = 10)
    private String normalBalance;

    @Column(name = "parent_account_id", length = 50)
    private String parentAccountId;

    @Column(name = "posting_allowed", nullable = false)
    private boolean postingAllowed;

    private String description;

    @Column(nullable = false, length = 20)
    private String status;

    /** Running balance maintained by postings (book balance). */
    @Column(nullable = false, precision = 20, scale = 2)
    private BigDecimal balance;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    protected Account() {
    }

    public Account(String id, String code, String name, String type, String normalBalance,
            String parentAccountId, boolean postingAllowed, String description, String status,
            String createdBy) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = type;
        this.normalBalance = normalBalance;
        this.parentAccountId = parentAccountId;
        this.postingAllowed = postingAllowed;
        this.description = description;
        this.status = status;
        this.createdBy = createdBy;
        this.balance = BigDecimal.ZERO;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (balance == null) {
            balance = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void update(String name, String type, String normalBalance, String parentAccountId,
            boolean postingAllowed, String description, String status, String updatedBy) {
        this.name = name;
        this.type = type;
        this.normalBalance = normalBalance;
        this.parentAccountId = parentAccountId;
        this.postingAllowed = postingAllowed;
        this.description = description;
        this.status = status;
        this.updatedBy = updatedBy;
    }

    public void toggleStatus(String updatedBy) {
        this.status = "ACTIVE".equals(this.status) ? "INACTIVE" : "ACTIVE";
        this.updatedBy = updatedBy;
    }

    public void applyPosting(BigDecimal debit, BigDecimal credit) {
        BigDecimal net = debit.subtract(credit);
        if ("CREDIT".equals(this.normalBalance)) {
            net = net.negate();
        }
        this.balance = this.balance.add(net);
    }

    public String getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getNormalBalance() { return normalBalance; }
    public String getParentAccountId() { return parentAccountId; }
    public boolean isPostingAllowed() { return postingAllowed; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public BigDecimal getBalance() { return balance; }
    public Instant getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public Instant getUpdatedAt() { return updatedAt; }
    public String getUpdatedBy() { return updatedBy; }
}
