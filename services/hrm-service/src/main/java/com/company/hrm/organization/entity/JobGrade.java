package com.company.hrm.organization.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "job_grade")
@NoArgsConstructor
@AllArgsConstructor
public class JobGrade extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private int level;

    private String description;

    @Column(name = "min_salary", precision = 19, scale = 4)
    private BigDecimal minSalary;

    @Column(name = "max_salary", precision = 19, scale = 4)
    private BigDecimal maxSalary;
}
