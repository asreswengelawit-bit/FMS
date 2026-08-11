package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.InteractionType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InteractionResponseDTO {

    private Long id;

    private String interactionNumber;

    private Long customerId;

    private Long leadId;

    private Long opportunityId;

    private InteractionType interactionType;

    private String subject;

    private String description;

    private String conductedBy;

    private String contactPerson;

    private LocalDateTime interactionDate;

    private LocalDateTime nextFollowUpDate;

    private String outcome;

    private Boolean completed;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
