package com.company.fms.bank;

import java.net.URI;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.company.fms.bank.dto.BankAccountResponse;
import com.company.fms.bank.dto.BankReconciliationSummary;
import com.company.fms.bank.dto.BankStatementLineResponse;
import com.company.fms.bank.dto.CashPosition;
import com.company.fms.bank.dto.CreateBankAccountRequest;
import com.company.fms.bank.dto.ImportStatementLineRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/bank-accounts")
public class BankAccountController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final BankAccountService service;

    public BankAccountController(BankAccountService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public List<BankAccountResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public BankAccountResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<BankAccountResponse> create(@Valid @RequestBody CreateBankAccountRequest request) {
        BankAccountResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize(WRITE_ROLES)
    public BankAccountResponse update(@PathVariable String id, @Valid @RequestBody CreateBankAccountRequest request) {
        return service.update(id, request);
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize(WRITE_ROLES)
    public BankAccountResponse activate(@PathVariable String id) {
        return service.setActive(id, true);
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize(WRITE_ROLES)
    public BankAccountResponse deactivate(@PathVariable String id) {
        return service.setActive(id, false);
    }

    @GetMapping("/{id}/reconciliation")
    @PreAuthorize(READ_ROLES)
    public BankReconciliationSummary reconciliation(@PathVariable String id) {
        return service.summarizeReconciliation(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize(WRITE_ROLES)
    public BankAccountResponse updateStatus(@PathVariable String id, @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    @GetMapping("/{id}/cash-position")
    @PreAuthorize(READ_ROLES)
    public CashPosition cashPosition(@PathVariable String id) {
        return service.cashPosition(id);
    }

    @PostMapping("/{id}/statements/import")
    @PreAuthorize(WRITE_ROLES)
    public List<BankStatementLineResponse> importStatements(@PathVariable String id,
            @RequestBody List<@Valid ImportStatementLineRequest> lines) {
        return service.importStatementLines(id, lines);
    }

    @GetMapping("/{id}/reconciliation-report")
    @PreAuthorize(READ_ROLES)
    public Page<BankStatementLineResponse> reconciliationReport(@PathVariable String id,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return service.reconciliationReport(id, status, PageRequest.of(page, size));
    }

    @PatchMapping("/statements/{lineId}/match")
    @PreAuthorize(WRITE_ROLES)
    public BankStatementLineResponse match(@PathVariable String lineId, @RequestParam String paymentId) {
        return service.matchStatementLine(lineId, paymentId);
    }

    @PatchMapping("/statements/{lineId}/flag-exception")
    @PreAuthorize(WRITE_ROLES)
    public BankStatementLineResponse flagException(@PathVariable String lineId) {
        return service.flagException(lineId);
    }
}
