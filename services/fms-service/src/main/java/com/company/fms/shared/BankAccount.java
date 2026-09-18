package com.company.fms.shared;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "bank_accounts")
public class BankAccount {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "account_name", nullable = false)
    private String accountName;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Column(name = "bank_name")
    private String bankName;

    private String branch;

    @Column(length = 10)
    private String currency;

    @Column(name = "opening_balance", nullable = false, precision = 20, scale = 2)
    private BigDecimal openingBalance;

    @Column(name = "current_balance", nullable = false, precision = 20, scale = 2)
    private BigDecimal currentBalance;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    protected BankAccount() {
    }

    public BankAccount(String id, String accountName, String accountNumber, String bankName,
            String branch, String currency, BigDecimal openingBalance, String createdBy) {
        this.id = id;
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.bankName = bankName;
        this.branch = branch;
        this.currency = currency;
        this.openingBalance = openingBalance;
        this.currentBalance = openingBalance;
        this.active = true;
        this.createdBy = createdBy;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (currentBalance == null) {
            currentBalance = openingBalance;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getAccountName() { return accountName; }
    public String getAccountNumber() { return accountNumber; }
    public String getBankName() { return bankName; }
    public String getBranch() { return branch; }
    public String getCurrency() { return currency; }
    public BigDecimal getOpeningBalance() { return openingBalance; }
    public BigDecimal getCurrentBalance() { return currentBalance; }
    public boolean isActive() { return active; }
    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void update(String accountName, String accountNumber, String bankName, String branch,
            String currency, BigDecimal openingBalance) {
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.bankName = bankName;
        this.branch = branch;
        this.currency = currency;
        this.currentBalance = this.currentBalance.add(openingBalance.subtract(this.openingBalance));
        this.openingBalance = openingBalance;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
