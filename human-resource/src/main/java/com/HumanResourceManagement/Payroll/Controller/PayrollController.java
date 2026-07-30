package com.HumanResourceManagement.Payroll.Controller;

import com.HumanResourceManagement.Payroll.DTO.PayrollRequest;
import com.HumanResourceManagement.Payroll.DTO.PayrollResponse;
import com.HumanResourceManagement.Payroll.Model.PayrollStatus;
import com.HumanResourceManagement.Payroll.Service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payrolls")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping
    public ResponseEntity<PayrollResponse> createPayroll(@Valid @RequestBody PayrollRequest requestDto) {
        PayrollResponse response = payrollService.createPayroll(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayrollResponse> getPayrollById(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getPayrollById(id));
    }

    @GetMapping
    public ResponseEntity<List<PayrollResponse>> getAllPayrolls() {
        return ResponseEntity.ok(payrollService.getAllPayrolls());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollResponse>> getPayrollsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getPayrollsByEmployee(employeeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PayrollResponse> updatePayroll(
            @PathVariable Long id,
            @Valid @RequestBody PayrollRequest requestDto) {
        return ResponseEntity.ok(payrollService.updatePayroll(id, requestDto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PayrollResponse> updatePayrollStatus(
            @PathVariable Long id,
            @RequestParam PayrollStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate paymentDate) {
        return ResponseEntity.ok(payrollService.updateStatus(id, status, paymentDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
        payrollService.deletePayroll(id);
        return ResponseEntity.noContent().build();
    }
}