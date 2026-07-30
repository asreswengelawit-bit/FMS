package com.HumanResourceManagement.Employee.Model;

// package com.HumanResourceManagement.Employee.entity;

// import com.HumanResourceManagement.Organization.entity.Department;
// import com.HumanResourceManagement.Organization.entity.Position;
// // import com.HumanResourceManagement.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.HumanResourceManagement.Organization.Model.Department;
import com.HumanResourceManagement.Organization.Model.Position;

@Data
@Entity
@Table(name = "employment_histories")

public class EmploymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_position_id")
    private Position previousPosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_position_id", nullable = false)
    private Position newPosition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_department_id")
    private Department previousDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_department_id", nullable = false)
    private Department newDepartment;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_type", nullable = false)
    private ChangeType changeType;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_id", nullable = false)
    private Employee approvedBy;

    public enum ChangeType {
        PROMOTION, TRANSFER, DEMOTION, SALARY_CHANGE
    }
}