package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.CampaignType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CampaignCreateDTO {

    @NotBlank
    private String campaignName;

    private String description;

    @NotNull
    private CampaignType campaignType;

    private BigDecimal budget;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal expectedRevenue;

    private Integer expectedLeads;

    private String targetAudience;

    private String notes;
}
