package com.crm.crm_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CampaignMetricsResponseDTO {

    private Long campaignId;
    private String campaignNumber;
    private String campaignName;
    private String status;
    private BigDecimal budget;
    private BigDecimal expectedRevenue;
    private BigDecimal actualRevenue;
    private Integer expectedLeads;
    private Integer actualLeads;
    private Double leadAchievementRate;
    private Double revenueAchievementRate;
    private LocalDateTime latestSnapshotAt;
    private List<CampaignMetricsSnapshotDTO> snapshots;
}
