package com.crm.crm_backend.model.entity;

// model/entity/CustomerContact.java

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "crm_customer_contacts")
public class CustomerContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String contactName;
    private String contactTitle;
    private String department;
    private String email;
    private String phone;
    private String mobile;

    @Column(name = "is_primary")
    private boolean isPrimary = false;

    @Column(name = "is_billing_contact")
    private boolean isBillingContact = false;

    private String preferredContactTime;
    private String notes;
}