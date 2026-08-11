package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.OpportunityStage;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class OpportunityUpdateDTO {

    private String opportunityName;

    private String description;

    private OpportunityStage stage;

    private BigDecimal expectedRevenue;

    @Min(0)
    @Max(100)
    private Integer probability;

    private LocalDate expectedCloseDate;

    private LocalDate actualCloseDate;

    private String assignedTo;

    private String nextStep;

    private String notes;

    private Boolean active;
}
