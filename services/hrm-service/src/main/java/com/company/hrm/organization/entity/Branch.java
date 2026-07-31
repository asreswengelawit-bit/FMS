package com.company.hrm.organization.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "branch")
@NoArgsConstructor
@AllArgsConstructor
public class Branch extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private String address;
    private String city;
    private String region;
    private String country;
    private String phone;
    private String email;

    @Column(name = "is_headquarters", nullable = false)
    private boolean isHeadquarters;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        ACTIVE, INACTIVE
    }
}
