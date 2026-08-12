package com.crm.crm_backend.model.entity;

import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.model.enums.CampaignType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_number", nullable = false, unique = true)
    private String campaignNumber;

    @Column(nullable = false)
    private String campaignName;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignType campaignType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status;

    @Column(precision = 15, scale = 2)
    private BigDecimal budget;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(precision = 15, scale = 2)
    private BigDecimal expectedRevenue;

    @Column(precision = 15, scale = 2)
    private BigDecimal actualRevenue;

    private Integer expectedLeads;

    private Integer actualLeads;

    @Column(length = 1000)
    private String targetAudience;

    @Column(length = 2000)
    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = CampaignStatus.PLANNED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
