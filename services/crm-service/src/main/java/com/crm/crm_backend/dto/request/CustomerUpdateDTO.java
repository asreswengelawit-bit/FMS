package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.CustomerStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CustomerUpdateDTO {

    private String companyName;

    @NotBlank(message = "Contact name is required")
    private String contactName;

    private String contactTitle;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
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

    private Long territoryId;
}
