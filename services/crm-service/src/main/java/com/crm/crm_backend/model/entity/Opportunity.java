package com.crm.crm_backend.model.entity;

import com.crm.crm_backend.model.enums.LeadSource;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.model.enums.OpportunityType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "opportunity_number", unique = true, nullable = false)
    private String opportunityNumber;

    @Column(name = "opportunity_name", nullable = false)
    private String opportunityName;

    @Column(length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpportunityStage stage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpportunityType type;

    @Enumerated(EnumType.STRING)
    private LeadSource source;

    @Column(name = "expected_revenue", precision = 15, scale = 2)
    private BigDecimal expectedRevenue;

    @Column(name = "probability")
    private Integer probability;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Column(name = "actual_close_date")
    private LocalDate actualCloseDate;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(length = 1000)
    private String nextStep;

    @Column(length = 2000)
    private String notes;

    @Builder.Default
    @Column(name = "active")
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (stage == null) {
            stage = OpportunityStage.NEW;
        }

        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}