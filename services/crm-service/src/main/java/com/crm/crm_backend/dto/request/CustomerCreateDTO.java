package com.crm.crm_backend.dto.request;

import com.crm.crm_backend.model.enums.CustomerType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CustomerCreateDTO {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotNull(message = "Customer type is required")
    private CustomerType customerType;

    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String address;

    private String city;

    private String country;

    private String postalCode;

    private String industry;

    private String website;

    private String description;

    private Long territoryId;
}