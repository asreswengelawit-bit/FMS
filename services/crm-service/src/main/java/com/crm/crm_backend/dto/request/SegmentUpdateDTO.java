package com.crm.crm_backend.dto.request;


import lombok.Data;

@Data
public class SegmentUpdateDTO {

    private String description;

    private String criteriaValue;

    private Boolean active;
}
