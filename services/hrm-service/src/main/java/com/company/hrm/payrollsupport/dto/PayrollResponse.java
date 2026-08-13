package com.company.hrm.payrollsupport.dto;

import com.company.hrm.payrollsupport.entity.Payroll;
import com.company.hrm.payrollsupport.entity.PayrollStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponse {

    private Long id;
    private Long employeeId;
    private String employeeName; // Optional flattened field for convenience
    private LocalDate payPeriodStart;
    private LocalDate payPeriodEnd;
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal netSalary;
    private PayrollStatus status;
    private LocalDate paymentDate;
    private LocalDateTime createdAt;

    public static PayrollResponse fromEntity(Payroll payroll) {
        if (payroll == null)
            return null;

        String fullName = null;
        if (payroll.getEmployee() != null) {
            fullName = payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName();
        }

        return PayrollResponse.builder()
                .id(payroll.getId())
                .employeeId(payroll.getEmployee() != null ? payroll.getEmployee().getId() : null)
                .employeeName(fullName)
                .payPeriodStart(payroll.getPayPeriodStart())
                .payPeriodEnd(payroll.getPayPeriodEnd())
                .basicSalary(orZero(payroll.getBasicSalary()))
                .allowances(orZero(payroll.getAllowances()))
                .deductions(orZero(payroll.getDeductions()))
                .netSalary(orZero(payroll.getNetSalary()))
                .status(payroll.getStatus())
                .paymentDate(payroll.getPaymentDate())
                .createdAt(payroll.getCreatedAt())
                .build();
    }

    private static BigDecimal orZero(BigDecimal amount) {
        return amount != null ? amount : BigDecimal.ZERO;
    }
}
