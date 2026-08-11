package com.crm.crm_backend.model.entity;

// model/entity/CustomerAddress.java

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "crm_customer_addresses")
public class CustomerAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String addressType; // BILLING, SHIPPING, OFFICE, WAREHOUSE
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    @Column(name = "is_default")
    private boolean isDefault = false;
}
