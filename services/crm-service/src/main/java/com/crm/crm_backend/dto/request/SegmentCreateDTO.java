package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.SegmentCriteriaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SegmentCreateDTO {

    @NotBlank
    private String segmentName;

    private String description;

    @NotNull
    private SegmentCriteriaType criteriaType;

    @NotBlank
    private String criteriaValue;
}