package com.company.fms.shared;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "bank_statement_lines")
public class BankStatementLine {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "bank_account_id", nullable = false, length = 50)
    private String bankAccountId;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, precision = 20, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String type;

    private String reference;

    @Column(name = "reconciliation_status", nullable = false, length = 20)
    private String reconciliationStatus;

    @Column(name = "matched_payment_id", length = 50)
    private String matchedPaymentId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected BankStatementLine() {
    }

    public BankStatementLine(String id, String bankAccountId, LocalDate transactionDate,
            String description, BigDecimal amount, String type, String reference) {
        this.id = id;
        this.bankAccountId = bankAccountId;
        this.transactionDate = transactionDate;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.reference = reference;
        this.reconciliationStatus = "UNMATCHED";
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public void markMatched(String paymentId) {
        this.reconciliationStatus = "MATCHED";
        this.matchedPaymentId = paymentId;
    }

    public void flagException() {
        this.reconciliationStatus = "EXCEPTION";
    }

    public String getId() { return id; }
    public String getBankAccountId() { return bankAccountId; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public String getDescription() { return description; }
    public BigDecimal getAmount() { return amount; }
    public String getType() { return type; }
    public String getReference() { return reference; }
    public String getReconciliationStatus() { return reconciliationStatus; }
    public String getMatchedPaymentId() { return matchedPaymentId; }
    public Instant getCreatedAt() { return createdAt; }
}
