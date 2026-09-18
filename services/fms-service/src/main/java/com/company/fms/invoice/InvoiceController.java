package com.company.fms.invoice;

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

import com.company.fms.invoice.dto.CreateInvoiceRequest;
import com.company.fms.invoice.dto.InvoiceResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fms/invoices")
public class InvoiceController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final InvoiceService service;

    public InvoiceController(InvoiceService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public Page<InvoiceResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return service.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public InvoiceResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<InvoiceResponse> create(@Valid @RequestBody CreateInvoiceRequest request) {
        InvoiceResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize(WRITE_ROLES)
    public InvoiceResponse submit(@PathVariable String id) {
        return service.submit(id);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public InvoiceResponse approve(@PathVariable String id) {
        return service.approve(id);
    }

    @PostMapping("/{id}/post")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public InvoiceResponse post(@PathVariable String id) {
        return service.post(id);
    }
}
