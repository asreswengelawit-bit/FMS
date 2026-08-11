package com.crm.crm_backend.dto.request;

import java.math.BigDecimal;
import com.crm.crm_backend.model.enums.LeadSource;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeadCreateDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
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
    private String preferredContactMethod;

    private String bestTimeToContact;

    private BigDecimal budget;

    private String authority;

    private String need;

    private String timeline;

    private String assignedTeam;

    private Long campaignId;

    private Long territoryId;

    private String internalNotes;
    private LeadSource source;
    private String sourceDetails;
    private String assignedTo;
    private String notes;
}
