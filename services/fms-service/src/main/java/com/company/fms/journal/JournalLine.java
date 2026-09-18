package com.company.fms.journal;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "journal_lines")
public class JournalLine {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "journal_id", nullable = false)
    private JournalEntry journal;

    @Column(name = "account_id", nullable = false, length = 50)
    private String accountId;

    @Column(name = "account_code", length = 50)
    private String accountCode;

    @Column(name = "account_name", length = 255)
    private String accountName;

    @Column(name = "debit_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal debitAmount;

    @Column(name = "credit_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal creditAmount;

    private String description;

    protected JournalLine() {
    }

    public JournalLine(String id, String accountId, String accountCode, String accountName,
            BigDecimal debitAmount, BigDecimal creditAmount, String description) {
        this.id = id;
        this.accountId = accountId;
        this.accountCode = accountCode;
        this.accountName = accountName;
        this.debitAmount = debitAmount;
        this.creditAmount = creditAmount;
        this.description = description;
    }

    void attachTo(JournalEntry journal) {
        this.journal = journal;
    }

    public String getId() { return id; }
    public JournalEntry getJournal() { return journal; }
    public String getAccountId() { return accountId; }
    public String getAccountCode() { return accountCode; }
    public String getAccountName() { return accountName; }
    public BigDecimal getDebitAmount() { return debitAmount; }
    public BigDecimal getCreditAmount() { return creditAmount; }
    public String getDescription() { return description; }
}
