package com.company.hrm.employee.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.company.hrm.department.entity.Department;
import com.company.hrm.organization.entity.Position;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "employment_history")
public class EmploymentHistory extends Auditable {

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
