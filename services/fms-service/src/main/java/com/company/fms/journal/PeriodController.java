package com.company.fms.journal;

import java.net.URI;
import java.util.List;

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

import com.company.fms.journal.dto.AccountingPeriodResponse;
import com.company.fms.journal.dto.CreatePeriodRequest;
import com.company.fms.journal.dto.PeriodCloseChecklist;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fms/periods")
public class PeriodController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'finance_manager', 'general_accountant')";

    private final PeriodService service;

    public PeriodController(PeriodService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public List<AccountingPeriodResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public AccountingPeriodResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<AccountingPeriodResponse> create(@Valid @RequestBody CreatePeriodRequest request) {
        AccountingPeriodResponse created = service.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/soft-close")
    @PreAuthorize(WRITE_ROLES)
    public AccountingPeriodResponse softClose(@PathVariable String id,
            @RequestParam(required = false) String closeNotes) {
        return service.softClose(id, closeNotes);
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public AccountingPeriodResponse close(@PathVariable String id) {
        return service.close(id);
    }

    @PostMapping("/{id}/reopen")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public AccountingPeriodResponse reopen(@PathVariable String id, @RequestBody(required = false) ReopenRequest request) {
        return service.reopen(id, request == null ? null : request.reason());
    }

    @GetMapping("/{id}/pre-close-checklist")
    @PreAuthorize(READ_ROLES)
    public PeriodCloseChecklist preCloseChecklist(@PathVariable String id) {
        return service.preCloseChecklist(id);
    }

    public record ReopenRequest(String reason) {
    }
}
