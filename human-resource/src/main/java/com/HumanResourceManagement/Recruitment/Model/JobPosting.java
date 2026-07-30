package com.HumanResourceManagement.Recruitment.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Organization.Model.Department;
import com.HumanResourceManagement.Organization.Model.Position;

@Getter
@Setter
@Entity
@Table(name = "job_postings")
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting {

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
    private Employee createdBy;

    public enum EmploymentType {
        FULL_TIME, PART_TIME, CONTRACT, INTERN
    }

    public enum Status {
        OPEN, CLOSED, DRAFT
    }
}