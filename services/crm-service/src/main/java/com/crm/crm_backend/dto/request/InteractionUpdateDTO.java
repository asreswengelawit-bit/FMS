package com.crm.crm_backend.dto.request;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InteractionUpdateDTO {

    private String subject;

    private String description;

    private String conductedBy;

    private String contactPerson;

    private LocalDateTime interactionDate;

    private LocalDateTime nextFollowUpDate;

    private String outcome;

    private Boolean completed;
}