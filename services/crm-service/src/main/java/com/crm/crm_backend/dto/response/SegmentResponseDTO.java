package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.SegmentCriteriaType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SegmentResponseDTO {

    private Long id;

    private String segmentNumber;

    private String segmentName;

    private String description;

    private SegmentCriteriaType criteriaType;

    private String criteriaValue;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
