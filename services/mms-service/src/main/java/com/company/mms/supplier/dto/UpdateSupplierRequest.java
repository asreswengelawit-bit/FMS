package com.company.mms.supplier.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateSupplierRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Size(max = 255) String contactPerson,
        @Email @Size(max = 255) String email,
        @Size(max = 30) String phoneNumber,
        @Size(max = 1000) String address,
        @Pattern(regexp = "ACTIVE|INACTIVE|BLOCKED|PROBATION", message = "Invalid supplier status") String status) {
}
