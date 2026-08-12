package com.company.hrm.organization.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import com.company.hrm.department.entity.Department;
import com.company.hrm.shared.audit.Auditable;

/** A job position / title. Table is `job_position`: `position` is a SQL function name. */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "job_position")
@NoArgsConstructor
@AllArgsConstructor
public class Position extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_grade_id")
    private JobGrade jobGrade;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "min_salary", precision = 19, scale = 4)
    private BigDecimal minSalary;

    @Column(name = "max_salary", precision = 19, scale = 4)
    private BigDecimal maxSalary;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    public enum Status {
        ACTIVE, INACTIVE
    }
}
