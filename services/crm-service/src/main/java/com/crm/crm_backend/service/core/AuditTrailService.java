package com.crm.crm_backend.service.core;


import com.crm.crm_backend.dto.response.AuditTrailResponseDTO;
import com.crm.crm_backend.mapper.AuditTrailMapper;
import com.crm.crm_backend.model.entity.AuditTrail;
import com.crm.crm_backend.model.enums.AuditAction;
import com.crm.crm_backend.model.enums.AuditModule;
import com.crm.crm_backend.repository.AuditTrailRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditTrailService {

    private final AuditTrailRepository auditTrailRepository;
    private final AuditTrailMapper auditTrailMapper;

    public List<AuditTrailResponseDTO> getAllAuditTrails() {
        return auditTrailMapper.toResponseDTOList(
                auditTrailRepository.findAll()
        );
    }

    public AuditTrailResponseDTO getAuditTrailById(Long id) {
        AuditTrail auditTrail = auditTrailRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Audit Trail not found with id: " + id));

        return auditTrailMapper.toResponseDTO(auditTrail);
    }

    public List<AuditTrailResponseDTO> getByModule(AuditModule module) {
        return auditTrailMapper.toResponseDTOList(
                auditTrailRepository.findByModule(module)
        );
    }

    public List<AuditTrailResponseDTO> getByAction(AuditAction action) {
        return auditTrailMapper.toResponseDTOList(
                auditTrailRepository.findByAction(action)
        );
    }

    public List<AuditTrailResponseDTO> getByPerformedBy(String performedBy) {
        return auditTrailMapper.toResponseDTOList(
                auditTrailRepository.findByPerformedBy(performedBy)
        );
    }

    public List<AuditTrailResponseDTO> getByDateRange(LocalDateTime start,
                                                      LocalDateTime end) {

        return auditTrailMapper.toResponseDTOList(
                auditTrailRepository.findByPerformedAtBetween(start, end)
        );
    }

    /**
     * Used internally by AuditLogAspect or Event Listeners.
     */
    public AuditTrail save(AuditTrail auditTrail) {
        return auditTrailRepository.save(auditTrail);
    }
}