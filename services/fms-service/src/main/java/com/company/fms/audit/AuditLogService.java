package com.company.fms.audit;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.audit.dto.AuditLogResponse;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional
public class AuditLogService {

    private final AuditLogRepository repository;
    private final CurrentUser currentUser;

    public AuditLogService(AuditLogRepository repository, CurrentUser currentUser) {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public Page<AuditLogResponse> findAll(String entityType, String entityId, String performedBy,
            String action, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "performedAt"));
        Page<AuditLog> result;
        if (entityType != null && !entityType.isBlank()) {
            result = repository.findByEntityTypeOrderByPerformedAtDesc(entityType, pageable);
        } else if (entityId != null && !entityId.isBlank()) {
            result = repository.findByEntityIdOrderByPerformedAtDesc(entityId, pageable);
        } else if (performedBy != null && !performedBy.isBlank()) {
            result = repository.findByPerformedByOrderByPerformedAtDesc(performedBy, pageable);
        } else if (action != null && !action.isBlank()) {
            result = repository.findByActionOrderByPerformedAtDesc(action, pageable);
        } else {
            result = repository.findAllByOrderByPerformedAtDesc(pageable);
        }
        return result.map(AuditLogResponse::from);
    }

    public AuditLogResponse findById(String id) {
        return AuditLogResponse.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Audit log not found: " + id)));
    }

    public void record(String entityType, String entityId, String action,
            Map<String, String> changes, String ipAddress) {
        AuditLog log = new AuditLog(
                java.util.UUID.randomUUID().toString(),
                entityType,
                entityId,
                action,
                currentUser.get(),
                java.time.Instant.now(),
                changes,
                ipAddress);
        repository.save(log);
    }
}
