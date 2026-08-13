package com.company.hrm.recruitment.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.department.entity.Department;
import com.company.hrm.organization.entity.Position;

@Getter
@Setter
@Entity
@Table(name = "job_posting")
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(length = 2000)
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false)
    private EmploymentType employmentType;

    @Column(name = "number_of_openings", nullable = false)
    private int numberOfOpenings;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    @Column(name = "closing_date", nullable = false)
    private LocalDate closingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private Employee createdByEmployee;

    public enum EmploymentType {
        FULL_TIME, PART_TIME, CONTRACT, INTERN
    }

    public enum Status {
        OPEN, CLOSED, DRAFT
    }
}
