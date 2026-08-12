package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.InteractionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InteractionCreateDTO {

    private Long customerId;

    private Long leadId;

    private Long opportunityId;

    @NotNull
    private InteractionType interactionType;

    @NotBlank
    private String subject;

    private String description;

    private String conductedBy;

    private String contactPerson;

    private LocalDateTime interactionDate;

    private LocalDateTime nextFollowUpDate;

    private String outcome;
}