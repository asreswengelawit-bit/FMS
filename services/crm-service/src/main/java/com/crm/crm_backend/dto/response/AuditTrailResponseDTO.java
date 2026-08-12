package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.AuditAction;
import com.crm.crm_backend.model.enums.AuditModule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditTrailResponseDTO {

    private Long id;

    private AuditModule module;

    private AuditAction action;

    private Long entityId;

    private String entityName;

    private String performedBy;

    private LocalDateTime performedAt;

    private String description;

    private String ipAddress;

}