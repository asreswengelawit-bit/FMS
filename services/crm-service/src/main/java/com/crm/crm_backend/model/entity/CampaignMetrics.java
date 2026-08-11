package com.crm.crm_backend.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaign_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "status_snapshot", length = 40)
    private String statusSnapshot;

    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    @Column(name = "expected_revenue", precision = 15, scale = 2)
    private BigDecimal expectedRevenue;

    @Column(name = "actual_revenue", precision = 15, scale = 2)
    private BigDecimal actualRevenue;

    @Column(name = "expected_leads")
    private Integer expectedLeads;

    @Column(name = "actual_leads")
    private Integer actualLeads;

    @Column(length = 1000)
    private String notes;

    @PrePersist
    public void prePersist() {
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }
}
