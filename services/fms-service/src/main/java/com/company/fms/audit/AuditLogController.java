package com.company.fms.audit;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.fms.audit.dto.AuditLogResponse;

@RestController
@RequestMapping("/api/v1/audit-logs")
public class AuditLogController {

    private final AuditLogService service;

    public AuditLogController(AuditLogService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public Page<AuditLogResponse> findAll(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String entityId,
            @RequestParam(required = false) String performedBy,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return service.findAll(entityType, entityId, performedBy, action, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'finance_manager')")
    public AuditLogResponse findById(@PathVariable String id) {
        return service.findById(id);
    }
}
