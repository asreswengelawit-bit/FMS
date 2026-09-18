package com.company.fms.payable;

import java.net.URI;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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

import com.company.fms.payable.dto.ApAgingReport;
import com.company.fms.payable.dto.CreateVendorRequest;
import com.company.fms.payable.dto.VendorResponse;
import com.company.fms.payable.dto.VendorStatement;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fms/vendors")
public class VendorController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final VendorService service;

    public VendorController(VendorService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public Page<VendorResponse> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.findAll(search, status, PageRequest.of(page, size));
    }

    @GetMapping("/reports/aging")
    @PreAuthorize(READ_ROLES)
    public ApAgingReport aging(@RequestParam(required = false) String asOfDate) {
        LocalDate asOf = asOfDate == null || asOfDate.isBlank() ? null : LocalDate.parse(asOfDate);
        return service.apAgingReport(asOf);
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public VendorResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/statement")
    @PreAuthorize(READ_ROLES)
    public VendorStatement statement(@PathVariable String id) {
        return service.getStatement(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<VendorResponse> create(@Valid @RequestBody CreateVendorRequest request) {
        VendorResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize(WRITE_ROLES)
    public VendorResponse update(@PathVariable String id, @Valid @RequestBody CreateVendorRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize(WRITE_ROLES)
    public VendorResponse activate(@PathVariable String id) {
        return service.setActive(id, true);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize(WRITE_ROLES)
    public VendorResponse deactivate(@PathVariable String id) {
        return service.setActive(id, false);
    }
}
