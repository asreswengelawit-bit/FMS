package com.company.hrm.payrollsupport.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.shared.audit.Auditable;

/**
 * HR-side payroll source data. HRM computes and owns it; FMS turns it into a
 * salary-expense journal off the {@code PayrollProcessed} event — HRM never posts
 * accounting entries itself (blueprint §1).
 */
@Getter
@Setter
@Entity
@Table(name = "payroll")
@NoArgsConstructor
@AllArgsConstructor
public class Payroll extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;

    @Column(name = "pay_period_end", nullable = false)
    private LocalDate payPeriodEnd;

    @Column(name = "basic_salary", nullable = false, precision = 19, scale = 4)
    private BigDecimal basicSalary;

    @Column(name = "allowances", precision = 19, scale = 4)
    private BigDecimal allowances = BigDecimal.ZERO;

    @Column(name = "deductions", precision = 19, scale = 4)
    private BigDecimal deductions = BigDecimal.ZERO;

    @Column(name = "net_salary", nullable = false, precision = 19, scale = 4)
    private BigDecimal netSalary;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PayrollStatus status = PayrollStatus.PENDING;

    @Column(name = "payment_date")
    private LocalDate paymentDate;
}
