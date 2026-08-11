package com.crm.crm_backend.dto.response;

import com.crm.crm_backend.model.enums.CustomerStatus;
import com.crm.crm_backend.model.enums.CustomerType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CustomerResponseDTO {
    private Long id;
    private String customerNumber;
    private CustomerType customerType;
    private String companyName;
    private String contactName;
    private String contactTitle;
    private String email;
    private String phone;
    private String mobile;
    private String website;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String industry;
    private Integer employeeCount;
    private BigDecimal annualRevenue;
    private BigDecimal creditLimit;
    private BigDecimal currentBalance;
    private String paymentTerms;
    private CustomerStatus status;
    private String customerPriority;
    private boolean governmentEntity;
    private String department;
    private String dataClassification;
    private String securityClearance;
    private Long territoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
