package com.company.hrm.payrollsupport.service;

import com.company.hrm.payrollsupport.dto.PayrollRequest;
import com.company.hrm.payrollsupport.dto.PayrollResponse;
import com.company.hrm.payrollsupport.entity.PayrollStatus;

import java.time.LocalDate;
import java.util.List;

public interface PayrollService {

    PayrollResponse createPayroll(PayrollRequest requestDto);

    PayrollResponse getPayrollById(Long id);

    List<PayrollResponse> getAllPayrolls();

    List<PayrollResponse> getPayrollsByEmployee(Long employeeId);

    PayrollResponse updatePayroll(Long id, PayrollRequest requestDto);

    PayrollResponse updateStatus(Long id, PayrollStatus status, LocalDate paymentDate);

    void deletePayroll(Long id);
}