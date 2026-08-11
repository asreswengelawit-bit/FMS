package com.crm.crm_backend.mapper;


import com.crm.crm_backend.dto.response.AuditTrailResponseDTO;
import com.crm.crm_backend.model.entity.AuditTrail;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuditTrailMapper {

    AuditTrailResponseDTO toResponseDTO(AuditTrail auditTrail);

    List<AuditTrailResponseDTO> toResponseDTOList(List<AuditTrail> auditTrails);

}