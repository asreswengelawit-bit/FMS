package com.company.hrm.payrollsupport.dto;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.payrollsupport.entity.Payroll;
import com.company.hrm.payrollsupport.entity.PayrollStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Pay period start date is required")
    private LocalDate payPeriodStart;

    @NotNull(message = "Pay period end date is required")
    private LocalDate payPeriodEnd;

    @NotNull(message = "Basic salary is required")
    @PositiveOrZero(message = "Basic salary must be non-negative")
    private BigDecimal basicSalary;

    @PositiveOrZero(message = "Allowances must be non-negative")
    private BigDecimal allowances;

    @PositiveOrZero(message = "Deductions must be non-negative")
    private BigDecimal deductions;

    private PayrollStatus status;

    private LocalDate paymentDate;

    public Payroll toEntity(Employee employee) {
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setPayPeriodStart(this.payPeriodStart);
        payroll.setPayPeriodEnd(this.payPeriodEnd);
        payroll.setBasicSalary(this.basicSalary != null ? this.basicSalary : BigDecimal.ZERO);
        payroll.setAllowances(this.allowances != null ? this.allowances : BigDecimal.ZERO);
        payroll.setDeductions(this.deductions != null ? this.deductions : BigDecimal.ZERO);

        // Business Logic: Auto-calculate Net Salary = Basic + Allowances - Deductions
        payroll.setNetSalary(payroll.getBasicSalary()
                .add(payroll.getAllowances())
                .subtract(payroll.getDeductions()));

        payroll.setStatus(this.status != null ? this.status : PayrollStatus.PENDING);
        payroll.setPaymentDate(this.paymentDate);
        return payroll;
    }
}
