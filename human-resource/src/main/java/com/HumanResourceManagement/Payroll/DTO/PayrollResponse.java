package com.HumanResourceManagement.Payroll.DTO;

import com.HumanResourceManagement.Payroll.Model.Payroll;
import com.HumanResourceManagement.Payroll.Model.PayrollStatus;
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
                .basicSalary(payroll.getBasicSalary() != null ? BigDecimal.valueOf(payroll.getBasicSalary())
                        : BigDecimal.ZERO)
                .allowances(
                        payroll.getAllowances() != null ? BigDecimal.valueOf(payroll.getAllowances()) : BigDecimal.ZERO)
                .deductions(
                        payroll.getDeductions() != null ? BigDecimal.valueOf(payroll.getDeductions()) : BigDecimal.ZERO)
                .netSalary(
                        payroll.getNetSalary() != null ? BigDecimal.valueOf(payroll.getNetSalary()) : BigDecimal.ZERO)
                .status(payroll.getStatus())
                .paymentDate(payroll.getPaymentDate())
                .createdAt(payroll.getCreatedAt())
                .build();
    }
}