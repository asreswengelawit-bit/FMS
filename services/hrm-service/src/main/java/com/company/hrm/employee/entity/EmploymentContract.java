package com.company.hrm.employee.entity;

import com.company.hrm.shared.audit.Auditable;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "employment_contract")
public class EmploymentContract extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false)
    private ContractType contractType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "salary", nullable = false, precision = 19, scale = 4)
    private BigDecimal salary;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(name = "work_hours_per_week", nullable = false)
    private int workHoursPerWeek;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "signed_date")
    private LocalDate signedDate;

    @Column(name = "document_url")
    private String documentUrl;

    public enum ContractType {
        PERMANENT, TEMPORARY, INTERN, CONTRACT
    }

    public enum Status {
        ACTIVE, EXPIRED, TERMINATED
    }
}
