package com.company.fms.payment;

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

import com.company.fms.payment.dto.CreatePaymentRequest;
import com.company.fms.payment.dto.PaymentResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fms/payments")
public class PaymentController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public Page<PaymentResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return service.findAll(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public PaymentResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<PaymentResponse> create(@Valid @RequestBody CreatePaymentRequest request) {
        PaymentResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize(WRITE_ROLES)
    public PaymentResponse submit(@PathVariable String id) {
        return service.submit(id);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public PaymentResponse approve(@PathVariable String id) {
        return service.approve(id);
    }

    @PostMapping("/{id}/post")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public PaymentResponse post(@PathVariable String id) {
        return service.post(id);
    }
}
