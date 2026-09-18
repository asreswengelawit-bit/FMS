package com.company.fms.invoice;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "invoice_lines")
public class InvoiceLine {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(name = "account_id", nullable = false, length = 50)
    private String accountId;

    @Column(name = "account_code", length = 50)
    private String accountCode;

    @Column(name = "account_name", length = 255)
    private String accountName;

    private String description;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(name = "unit_price", nullable = false, precision = 20, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalPrice;

    protected InvoiceLine() {
    }

    public InvoiceLine(String id, String accountId, String accountCode, String accountName,
            String description, BigDecimal quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
        this.id = id;
        this.accountId = accountId;
        this.accountCode = accountCode;
        this.accountName = accountName;
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    void attachTo(Invoice invoice) {
        this.invoice = invoice;
    }

    public String getId() { return id; }
    public Invoice getInvoice() { return invoice; }
    public String getAccountId() { return accountId; }
    public String getAccountCode() { return accountCode; }
    public String getAccountName() { return accountName; }
    public String getDescription() { return description; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getTotalPrice() { return totalPrice; }
}
