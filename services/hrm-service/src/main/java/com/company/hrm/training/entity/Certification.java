package com.company.hrm.training.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.company.hrm.employee.entity.Employee;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "certification")
public class Certification extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram;

    @Column(nullable = false)
    private String name;

    @Column(name = "issuing_organization", nullable = false)
    private String issuingOrganization;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "certificate_url")
    private String certificateUrl;
}
