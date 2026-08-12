package com.crm.crm_backend.dto.request;

import com.crm.crm_backend.model.enums.LeadSource;
import com.crm.crm_backend.model.enums.OpportunityType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class OpportunityCreateDTO {

    @NotBlank(message = "Opportunity name is required")
    private String opportunityName;

    private String description;

    @NotNull(message = "Lead ID is required")
    private Long leadId;

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Opportunity type is required")
    private OpportunityType type;

    private LeadSource source;

    private BigDecimal expectedRevenue;

    @Min(0)
    @Max(100)
    private Integer probability;

    private LocalDate expectedCloseDate;

    private String assignedTo;

    private String nextStep;

    private String notes;
}
