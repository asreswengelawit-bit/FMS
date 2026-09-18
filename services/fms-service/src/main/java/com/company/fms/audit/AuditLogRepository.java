package com.company.fms.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    Page<AuditLog> findAllByOrderByPerformedAtDesc(Pageable pageable);

    Page<AuditLog> findByEntityTypeOrderByPerformedAtDesc(String entityType, Pageable pageable);

    Page<AuditLog> findByEntityIdOrderByPerformedAtDesc(String entityId, Pageable pageable);

    Page<AuditLog> findByPerformedByOrderByPerformedAtDesc(String performedBy, Pageable pageable);

    Page<AuditLog> findByActionOrderByPerformedAtDesc(String action, Pageable pageable);
}
