package com.crm.crm_backend.dto.request;



import lombok.Data;

@Data
public class LeadConvertDTO {

    private String conversionReason;
    private boolean createOpportunity = true;
    private Double opportunityValue;
    private String opportunityTitle;

}
