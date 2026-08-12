package com.crm.crm_backend.dto.request;

import com.crm.crm_backend.model.enums.LeadRating;
import com.crm.crm_backend.model.enums.LeadSource;
import com.crm.crm_backend.model.enums.LeadStatus;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LeadUpdateDTO {

    private String firstName;

    private String lastName;

    private String middleName;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

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

    private BigDecimal budget;

    private String authority;

    private String need;

    private String timeline;

    private Integer qualificationScore;

    private String assignedTo;

    private String assignedTeam;

    private Long campaignId;

    private Long territoryId;

    private String preferredContactMethod;

    private String bestTimeToContact;

    private String notes;

    private String internalNotes;
}
