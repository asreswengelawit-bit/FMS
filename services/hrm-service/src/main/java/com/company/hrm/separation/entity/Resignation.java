package com.company.hrm.separation.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.company.hrm.employee.entity.Employee;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "resignation")
public class Resignation extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "submitted_date", nullable = false)
    private LocalDate submittedDate;

    @Column(name = "last_working_date", nullable = false)
    private LocalDate lastWorkingDate;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column(name = "notice_period_days", nullable = false)
    private int noticePeriodDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_id")
    private Employee approvedBy;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}
