package com.HumanResourceManagement.Payroll.Repository;

import com.HumanResourceManagement.Payroll.Model.Payroll;
import com.HumanResourceManagement.Payroll.Model.PayrollStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    List<Payroll> findByEmployeeId(Long employeeId);

    List<Payroll> findByStatus(PayrollStatus status);

    List<Payroll> findByPayPeriodStartBetween(LocalDate startDate, LocalDate endDate);
}