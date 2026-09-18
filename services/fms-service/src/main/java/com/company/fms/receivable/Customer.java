package com.company.fms.receivable;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "customer_code", nullable = false, unique = true, length = 50)
    private String customerCode;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "contact_name")
    private String contactName;

    private String email;

    private String phone;

    private String address;

    @Column(name = "tax_id")
    private String taxId;

    @Column(name = "payment_terms")
    private String paymentTerms;

    @Column(length = 10)
    private String currency;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "ar_balance", nullable = false, precision = 20, scale = 2)
    private BigDecimal arBalance;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    protected Customer() {
    }

    public Customer(String id, String customerCode, String customerName, String contactName, String email,
            String phone, String address, String taxId, String paymentTerms, String currency,
            String createdBy) {
        this.id = id;
        this.customerCode = customerCode;
        this.customerName = customerName;
        this.contactName = contactName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.taxId = taxId;
        this.paymentTerms = paymentTerms;
        this.currency = currency;
        this.status = "ACTIVE";
        this.arBalance = BigDecimal.ZERO;
        this.createdBy = createdBy;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (arBalance == null) {
            arBalance = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void update(String customerName, String contactName, String email, String phone, String address,
            String taxId, String paymentTerms, String currency) {
        this.customerName = customerName;
        this.contactName = contactName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.taxId = taxId;
        this.paymentTerms = paymentTerms;
        this.currency = currency;
    }

    public void setActive(boolean active) {
        this.status = active ? "ACTIVE" : "INACTIVE";
    }

    public String getId() { return id; }
    public String getCustomerCode() { return customerCode; }
    public String getCustomerName() { return customerName; }
    public String getContactName() { return contactName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getTaxId() { return taxId; }
    public String getPaymentTerms() { return paymentTerms; }
    public String getCurrency() { return currency; }
    public String getStatus() { return status; }
    public BigDecimal getArBalance() { return arBalance; }
    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
