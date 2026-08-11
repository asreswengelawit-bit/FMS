package com.crm.crm_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CampaignMetricsSnapshotDTO {

    private Long id;
    private LocalDateTime recordedAt;
    private String statusSnapshot;
    private BigDecimal budget;
    private BigDecimal expectedRevenue;
    private BigDecimal actualRevenue;
    private Integer expectedLeads;
    private Integer actualLeads;
    private String notes;
}
