package com.crm.crm_backend.model.entity;

// model/entity/Customer.java

import com.crm.crm_backend.common.BaseEntity;
import com.crm.crm_backend.model.enums.CustomerStatus;
import com.crm.crm_backend.model.enums.CustomerType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "crm_customers")
public class Customer extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String customerNumber;

    @Enumerated(EnumType.STRING)
    private CustomerType customerType;

    private String companyName;
    private String contactName;
    private String contactTitle;

    @Column(unique = true)
    private String email;

    private String phone;
    private String mobile;
    private String website;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    private String industry;
    private Integer employeeCount;
    private BigDecimal annualRevenue;
    private BigDecimal creditLimit;
    private BigDecimal currentBalance;
    private String paymentTerms;

    @Enumerated(EnumType.STRING)
    private CustomerStatus status = CustomerStatus.ACTIVE;

    private String dataClassification = "CONFIDENTIAL";
    private String securityClearance = "LEVEL_1";
    private String customerPriority = "STANDARD";

    private boolean governmentEntity = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "territory_id")
    private Territory territory;
    private String department;

    @ManyToOne
    @JoinColumn(name = "parent_customer_id")
    private Customer parentCustomer;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerContact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerAddress> addresses = new ArrayList<>();
}
