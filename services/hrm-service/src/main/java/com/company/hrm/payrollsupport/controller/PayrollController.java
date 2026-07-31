package com.company.hrm.payrollsupport.controller;

import com.company.hrm.payrollsupport.dto.PayrollRequest;
import com.company.hrm.payrollsupport.dto.PayrollResponse;
import com.company.hrm.payrollsupport.entity.PayrollStatus;
import com.company.hrm.payrollsupport.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import org.springframework.security.access.prepost.PreAuthorize;
import com.company.hrm.shared.api.ApiResponse;
import com.company.hrm.shared.security.HrmPermissions;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@Tag(name = "Payroll", description = "Payroll source data — feeds the FMS salary journal")
@RestController
@RequestMapping("/api/v1/payrolls")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping
    @PreAuthorize(HrmPermissions.PAYROLL_CREATE)
    public ResponseEntity<ApiResponse<PayrollResponse>> createPayroll(@Valid @RequestBody PayrollRequest requestDto) {
        PayrollResponse response = payrollService.createPayroll(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Payroll record created"));
    }

    @GetMapping("/{id}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<PayrollResponse>> getPayrollById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.getPayrollById(id)));
    }

    @GetMapping
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getAllPayrolls() {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.getAllPayrolls()));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize(HrmPermissions.READ)
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getPayrollsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.getPayrollsByEmployee(employeeId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize(HrmPermissions.PAYROLL_UPDATE)
    public ResponseEntity<ApiResponse<PayrollResponse>> updatePayroll(
            @PathVariable Long id,
            @Valid @RequestBody PayrollRequest requestDto) {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.updatePayroll(id, requestDto)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize(HrmPermissions.PAYROLL_PROCESS)
    public ResponseEntity<ApiResponse<PayrollResponse>> updatePayrollStatus(
            @PathVariable Long id,
            @RequestParam PayrollStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate paymentDate) {
        return ResponseEntity.ok(ApiResponse.ok(payrollService.updateStatus(id, status, paymentDate)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(HrmPermissions.PAYROLL_DELETE)
    public ResponseEntity<ApiResponse<Void>> deletePayroll(@PathVariable Long id) {
        payrollService.deletePayroll(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Payroll record deleted"));
    }
}
