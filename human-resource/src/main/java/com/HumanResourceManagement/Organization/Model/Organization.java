package com.HumanResourceManagement.Organization.Model;

// import com.HumanResourceManagement.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "organizations")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "legal_name")
    private String legalName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "tax_id")
    private String taxId;
    @Column(name = "industry", nullable = true)
    private String industry;
    @Column(name = "address", nullable = true)
    private String address;
    @Column(name = "phone", nullable = true)
    private String phone;
    @Column(name = "email", nullable = true)
    private String email;
    @Column(name = "website", nullable = true)
    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "founded_date")
    private LocalDate foundedDate;
    @OneToMany(mappedBy = "organization", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Branch> branches = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
