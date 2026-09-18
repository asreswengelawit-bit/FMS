package com.company.fms.chartofaccount;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.company.fms.chartofaccount.dto.AccountResponse;
import com.company.fms.chartofaccount.dto.CreateAccountRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public Page<AccountResponse> findAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return service.findAll(type, status, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public AccountResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<AccountResponse> create(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize(WRITE_ROLES)
    public AccountResponse toggleStatus(@PathVariable String id) {
        return service.toggleStatus(id);
    }
}
