package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.AuditTrail;
import com.crm.crm_backend.model.enums.AuditAction;
import com.crm.crm_backend.model.enums.AuditModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditTrailRepository extends JpaRepository<AuditTrail, Long> {

    List<AuditTrail> findByModule(AuditModule module);

    List<AuditTrail> findByAction(AuditAction action);

    List<AuditTrail> findByPerformedBy(String performedBy);

    List<AuditTrail> findByEntityId(Long entityId);

    List<AuditTrail> findByPerformedAtBetween(LocalDateTime startDate,
                                              LocalDateTime endDate);

    List<AuditTrail> findByModuleAndAction(AuditModule module,
                                           AuditAction action);

    List<AuditTrail> findByModuleAndEntityId(AuditModule module,
                                             Long entityId);

}
