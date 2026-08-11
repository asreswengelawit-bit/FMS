package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.model.enums.CampaignType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CampaignResponseDTO {

    private Long id;

    private String campaignNumber;

    private String campaignName;

    private String description;

    private CampaignType campaignType;

    private CampaignStatus status;

    private BigDecimal budget;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal expectedRevenue;

    private BigDecimal actualRevenue;

    private Integer expectedLeads;

    private Integer actualLeads;

    private String targetAudience;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}