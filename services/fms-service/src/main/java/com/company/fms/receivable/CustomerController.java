package com.company.fms.receivable;

import java.net.URI;
import java.time.LocalDate;

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

import com.company.fms.receivable.dto.ArAgingReport;
import com.company.fms.receivable.dto.CreateCustomerRequest;
import com.company.fms.receivable.dto.CustomerResponse;
import com.company.fms.receivable.dto.CustomerStatement;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fms/customers")
public class CustomerController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public Page<CustomerResponse> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.findAll(search, status, PageRequest.of(page, size));
    }

    @GetMapping("/reports/aging")
    @PreAuthorize(READ_ROLES)
    public ArAgingReport aging(@RequestParam(required = false) String asOfDate) {
        LocalDate asOf = asOfDate == null || asOfDate.isBlank() ? null : LocalDate.parse(asOfDate);
        return service.arAgingReport(asOf);
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public CustomerResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/statement")
    @PreAuthorize(READ_ROLES)
    public CustomerStatement statement(@PathVariable String id) {
        return service.getStatement(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CreateCustomerRequest request) {
        CustomerResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize(WRITE_ROLES)
    public CustomerResponse update(@PathVariable String id, @Valid @RequestBody CreateCustomerRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize(WRITE_ROLES)
    public CustomerResponse activate(@PathVariable String id) {
        return service.setActive(id, true);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize(WRITE_ROLES)
    public CustomerResponse deactivate(@PathVariable String id) {
        return service.setActive(id, false);
    }
}
