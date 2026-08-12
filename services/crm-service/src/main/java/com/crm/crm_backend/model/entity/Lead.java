package com.crm.crm_backend.model.entity;

// model/entity/Lead.java

import com.crm.crm_backend.common.BaseEntity;
import com.crm.crm_backend.model.enums.LeadRating;
import com.crm.crm_backend.model.enums.LeadSource;
import com.crm.crm_backend.model.enums.LeadStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "crm_leads")
public class Lead extends BaseEntity {

    private String firstName;
    private String lastName;
    private String middleName;

    @Column(unique = true)
    private String email;

    private String phone;

    private String company;
    private String companySize;
    private String industry;
    private String jobTitle;
    private String department;

    @Enumerated(EnumType.STRING)
    private LeadSource source;

    private String sourceDetails;

    @Enumerated(EnumType.STRING)
    private LeadStatus status = LeadStatus.NEW;

    @Enumerated(EnumType.STRING)
    private LeadRating rating = LeadRating.WARM;

    private Integer leadScore = 0;

    private BigDecimal budget;
    private String authority;
    private String need;
    private String timeline;
    private Integer qualificationScore;

    private String assignedTo;
    private String assignedTeam;
    private Long campaignId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "territory_id")
    private Territory territory;

    private String preferredContactMethod;
    private String bestTimeToContact;

    @Lob
    private String notes;
    @Lob
    private String internalNotes;

    @ManyToOne
    @JoinColumn(name = "converted_customer_id")
    private Customer convertedCustomer;

    private Long convertedOpportunityId;
    private LocalDateTime convertedAt;
    private String conversionReason;

    private String dataClassification = "CONFIDENTIAL";
    private String securityClearance = "LEVEL_1";
}
