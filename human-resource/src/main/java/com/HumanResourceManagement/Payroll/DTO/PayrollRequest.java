package com.HumanResourceManagement.Payroll.DTO;

import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Payroll.Model.Payroll;
import com.HumanResourceManagement.Payroll.Model.PayrollStatus;
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
        payroll.setBasicSalary(this.basicSalary != null ? this.basicSalary.doubleValue() : 0.0);
        payroll.setAllowances(this.allowances != null ? this.allowances.doubleValue() : 0.0);
        payroll.setDeductions(this.deductions != null ? this.deductions.doubleValue() : 0.0);

        // Business Logic: Auto-calculate Net Salary = Basic + Allowances - Deductions
        double calculatedNet = payroll.getBasicSalary() + payroll.getAllowances() - payroll.getDeductions();
        payroll.setNetSalary(calculatedNet);

        payroll.setStatus(this.status != null ? this.status : PayrollStatus.PENDING);
        payroll.setPaymentDate(this.paymentDate);
        return payroll;
    }
}