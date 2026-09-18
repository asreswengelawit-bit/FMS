package com.company.fms.audit;

import java.time.Instant;
import java.util.Map;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false, length = 50)
    private String entityId;

    @Column(nullable = false, length = 20)
    private String action;

    @Column(name = "performed_by", nullable = false)
    private String performedBy;

    @Column(name = "performed_at", nullable = false)
    private Instant performedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "audit_log_changes", joinColumns = @JoinColumn(name = "audit_log_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "change_value", length = 2000)
    private Map<String, String> changes;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    protected AuditLog() {
    }

    public AuditLog(String id, String entityType, String entityId, String action,
            String performedBy, Instant performedAt, Map<String, String> changes, String ipAddress) {
        this.id = id;
        this.entityType = entityType;
        this.entityId = entityId;
        this.action = action;
        this.performedBy = performedBy;
        this.performedAt = performedAt;
        this.changes = changes;
        this.ipAddress = ipAddress;
    }

    public String getId() { return id; }
    public String getEntityType() { return entityType; }
    public String getEntityId() { return entityId; }
    public String getAction() { return action; }
    public String getPerformedBy() { return performedBy; }
    public Instant getPerformedAt() { return performedAt; }
    public Map<String, String> getChanges() { return changes; }
    public String getIpAddress() { return ipAddress; }
}
