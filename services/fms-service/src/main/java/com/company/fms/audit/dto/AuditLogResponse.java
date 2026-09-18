package com.company.fms.audit.dto;

import java.time.Instant;
import java.util.Map;

import com.company.fms.audit.AuditLog;

public record AuditLogResponse(
        String id,
        String entityType,
        String entityId,
        String action,
        String performedBy,
        Instant performedAt,
        Map<String, String> changes,
        String ipAddress) {

    public static AuditLogResponse from(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getEntityType(),
                log.getEntityId(),
                log.getAction(),
                log.getPerformedBy(),
                log.getPerformedAt(),
                log.getChanges(),
                log.getIpAddress());
    }
}
