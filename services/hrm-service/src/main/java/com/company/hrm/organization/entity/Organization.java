package com.company.hrm.organization.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

import com.company.hrm.shared.audit.Auditable;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "organization")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "legal_name")
    private String legalName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "tax_id")
    private String taxId;
    @Column(name = "industry")
    private String industry;
    @Column(name = "address")
    private String address;
    @Column(name = "phone")
    private String phone;
    @Column(name = "email")
    private String email;
    @Column(name = "website")
    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "founded_date")
    private LocalDate foundedDate;
    @OneToMany(mappedBy = "organization", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Branch> branches = new ArrayList<>();
}
