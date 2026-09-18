package com.company.fms.payable;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "vendors")
public class Vendor {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "vendor_code", nullable = false, unique = true, length = 50)
    private String vendorCode;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

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

    @Column(name = "ap_balance", nullable = false, precision = 20, scale = 2)
    private BigDecimal apBalance;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    protected Vendor() {
    }

    public Vendor(String id, String vendorCode, String vendorName, String contactName, String email,
            String phone, String address, String taxId, String paymentTerms, String currency,
            String createdBy) {
        this.id = id;
        this.vendorCode = vendorCode;
        this.vendorName = vendorName;
        this.contactName = contactName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.taxId = taxId;
        this.paymentTerms = paymentTerms;
        this.currency = currency;
        this.status = "ACTIVE";
        this.apBalance = BigDecimal.ZERO;
        this.createdBy = createdBy;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (apBalance == null) {
            apBalance = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void update(String vendorName, String contactName, String email, String phone, String address,
            String taxId, String paymentTerms, String currency) {
        this.vendorName = vendorName;
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
    public String getVendorCode() { return vendorCode; }
    public String getVendorName() { return vendorName; }
    public String getContactName() { return contactName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getTaxId() { return taxId; }
    public String getPaymentTerms() { return paymentTerms; }
    public String getCurrency() { return currency; }
    public String getStatus() { return status; }
    public BigDecimal getApBalance() { return apBalance; }
    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
