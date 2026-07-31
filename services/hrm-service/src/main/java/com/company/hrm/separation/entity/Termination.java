package com.company.hrm.separation.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.company.hrm.employee.entity.Employee;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "termination")
public class Termination extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "termination_date", nullable = false)
    private LocalDate terminationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "termination_type", nullable = false)
    private TerminationType terminationType;

    @Column(nullable = false, length = 1500)
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiated_by_id", nullable = false)
    private Employee initiatedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum TerminationType {
        VOLUNTARY, INVOLUNTARY, LAYOFF
    }

    public enum Status {
        PENDING, FINALIZED
    }
}
