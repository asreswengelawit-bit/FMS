package com.crm.crm_backend.dto;


import com.crm.crm_backend.model.enums.LeadStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeadStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private LeadStatus status;

    private String notes;
}