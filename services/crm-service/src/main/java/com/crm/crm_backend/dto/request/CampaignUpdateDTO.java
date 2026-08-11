package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.CampaignStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CampaignUpdateDTO {

    private CampaignStatus status;

    private BigDecimal actualRevenue;

    private Integer actualLeads;

    private LocalDate endDate;

    private String notes;
}
