package com.HumanResourceManagement.Payroll.Service;

import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Employee.Repository.EmployeeRepository;
import com.HumanResourceManagement.Payroll.DTO.PayrollRequest;
import com.HumanResourceManagement.Payroll.DTO.PayrollResponse;
import com.HumanResourceManagement.Payroll.Model.Payroll;
import com.HumanResourceManagement.Payroll.Model.PayrollStatus;
import com.HumanResourceManagement.Payroll.Repository.PayrollRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollResponse createPayroll(PayrollRequest requestDto) {
        Employee employee = employeeRepository.findById(requestDto.getEmployeeId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Employee not found with ID: " + requestDto.getEmployeeId()));

        Payroll payroll = requestDto.toEntity(employee);
        Payroll savedPayroll = payrollRepository.save(payroll);

        return PayrollResponse.fromEntity(savedPayroll);
    }

    @Transactional(readOnly = true)
    public PayrollResponse getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payroll record not found with ID: " + id));
        return PayrollResponse.fromEntity(payroll);
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getAllPayrolls() {
        return payrollRepository.findAll().stream()
                .map(PayrollResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getPayrollsByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId).stream()
                .map(PayrollResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public PayrollResponse updatePayroll(Long id, PayrollRequest requestDto) {
        Payroll existingPayroll = payrollRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payroll record not found with ID: " + id));

        Employee employee = employeeRepository.findById(requestDto.getEmployeeId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Employee not found with ID: " + requestDto.getEmployeeId()));

        existingPayroll.setEmployee(employee);
        existingPayroll.setPayPeriodStart(requestDto.getPayPeriodStart());
        existingPayroll.setPayPeriodEnd(requestDto.getPayPeriodEnd());

        double basic = requestDto.getBasicSalary() != null ? requestDto.getBasicSalary().doubleValue() : 0.0;
        double allowances = requestDto.getAllowances() != null ? requestDto.getAllowances().doubleValue() : 0.0;
        double deductions = requestDto.getDeductions() != null ? requestDto.getDeductions().doubleValue() : 0.0;

        existingPayroll.setBasicSalary(basic);
        existingPayroll.setAllowances(allowances);
        existingPayroll.setDeductions(deductions);

        // Recalculate net salary
        existingPayroll.setNetSalary(basic + allowances - deductions);

        if (requestDto.getStatus() != null) {
            existingPayroll.setStatus(requestDto.getStatus());
        }
        existingPayroll.setPaymentDate(requestDto.getPaymentDate());

        Payroll updatedPayroll = payrollRepository.save(existingPayroll);
        return PayrollResponse.fromEntity(updatedPayroll);
    }

    public PayrollResponse updateStatus(Long id, PayrollStatus status, LocalDate paymentDate) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payroll record not found with ID: " + id));

        payroll.setStatus(status);
        if (status == PayrollStatus.PAID && paymentDate == null) {
            payroll.setPaymentDate(LocalDate.now());
        } else if (paymentDate != null) {
            payroll.setPaymentDate(paymentDate);
        }

        Payroll updated = payrollRepository.save(payroll);
        return PayrollResponse.fromEntity(updated);
    }

    public void deletePayroll(Long id) {
        if (!payrollRepository.existsById(id)) {
            throw new EntityNotFoundException("Payroll record not found with ID: " + id);
        }
        payrollRepository.deleteById(id);
    }
}