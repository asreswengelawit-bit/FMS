package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.LeadSource;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.model.enums.OpportunityType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class OpportunityResponseDTO {

    private Long id;

    private String opportunityNumber;

    private String opportunityName;

    private String description;

    private Long leadId;

    private Long customerId;

    private OpportunityStage stage;

    private OpportunityType type;

    private LeadSource source;

    private BigDecimal expectedRevenue;

    private Integer probability;

    private LocalDate expectedCloseDate;

    private LocalDate actualCloseDate;

    private String assignedTo;

    private String nextStep;

    private String notes;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
