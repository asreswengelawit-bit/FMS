package com.crm.crm_backend.dto.response;

import com.crm.crm_backend.model.enums.LeadRating;
import com.crm.crm_backend.model.enums.LeadSource;
import com.crm.crm_backend.model.enums.LeadStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LeadResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private String email;
    private String phone;
    private String mobile;
    private String company;
    private String companySize;
    private String industry;
    private String jobTitle;
    private String department;
    private LeadSource source;
    private String sourceDetails;
    private LeadStatus status;
    private LeadRating rating;
    private Integer leadScore;
    private String assignedTo;
    private String assignedTeam;
    private Long campaignId;
    private String notes;
    private Long territoryId;
    private Long convertedCustomerId;
    private Long convertedOpportunityId;
    private LocalDateTime convertedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
