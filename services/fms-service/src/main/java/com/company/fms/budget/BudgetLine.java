package com.company.fms.budget;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "budget_lines")
public class BudgetLine {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    @Column(name = "account_id", nullable = false, length = 50)
    private String accountId;

    @Column(name = "account_code", length = 50)
    private String accountCode;

    @Column(name = "account_name", length = 255)
    private String accountName;

    @Column(name = "allocated_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(name = "draft_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal draftAmount;

    @Column(name = "posted_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal postedAmount;

    @Column(name = "paid_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal paidAmount;

    protected BudgetLine() {
    }

    public BudgetLine(String id, String accountId, String accountCode, String accountName,
            BigDecimal allocatedAmount) {
        this.id = id;
        this.accountId = accountId;
        this.accountCode = accountCode;
        this.accountName = accountName;
        this.allocatedAmount = allocatedAmount;
        this.draftAmount = BigDecimal.ZERO;
        this.postedAmount = BigDecimal.ZERO;
        this.paidAmount = BigDecimal.ZERO;
    }

    void attachTo(Budget budget) {
        this.budget = budget;
    }

    public BigDecimal totalSpent() {
        return postedAmount.add(paidAmount);
    }

    public BigDecimal remainingAmount() {
        return allocatedAmount.subtract(totalSpent());
    }

    public BigDecimal progressPercentage() {
        if (allocatedAmount.signum() == 0) {
            return BigDecimal.ZERO;
        }
        return totalSpent().divide(allocatedAmount, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    public String getId() { return id; }
    public Budget getBudget() { return budget; }
    public String getAccountId() { return accountId; }
    public String getAccountCode() { return accountCode; }
    public String getAccountName() { return accountName; }
    public BigDecimal getAllocatedAmount() { return allocatedAmount; }
    public BigDecimal getDraftAmount() { return draftAmount; }
    public BigDecimal getPostedAmount() { return postedAmount; }
    public BigDecimal getPaidAmount() { return paidAmount; }
}
