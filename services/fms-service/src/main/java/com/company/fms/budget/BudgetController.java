package com.company.fms.budget;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.company.fms.budget.dto.BudgetResponse;
import com.company.fms.budget.dto.BudgetVarianceReport;
import com.company.fms.budget.dto.CreateBudgetRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fms/budgets")
public class BudgetController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final BudgetService service;

    public BudgetController(BudgetService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public Page<BudgetResponse> findAll(
            @RequestParam(required = false) Integer fiscalYear,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.findAll(fiscalYear, status, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public BudgetResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/variance")
    @PreAuthorize(READ_ROLES)
    public BudgetVarianceReport variance(@PathVariable String id,
            @RequestParam(required = false) String periodId) {
        return service.variance(id, periodId);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<BudgetResponse> create(@Valid @RequestBody CreateBudgetRequest request) {
        BudgetResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize(WRITE_ROLES)
    public BudgetResponse submit(@PathVariable String id) {
        return service.submit(id);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public BudgetResponse approve(@PathVariable String id) {
        return service.approve(id);
    }
}
