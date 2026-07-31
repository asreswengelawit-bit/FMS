package com.company.hrm.payrollsupport.repository;

import com.company.hrm.payrollsupport.entity.Payroll;
import com.company.hrm.payrollsupport.entity.PayrollStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    List<Payroll> findByEmployeeId(Long employeeId);

    List<Payroll> findByStatus(PayrollStatus status);

    List<Payroll> findByPayPeriodStartBetween(LocalDate startDate, LocalDate endDate);
}
