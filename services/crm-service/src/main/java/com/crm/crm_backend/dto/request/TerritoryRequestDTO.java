package com.crm.crm_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TerritoryRequestDTO {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    private String region;

    private String description;

    private String managerUsername;

    private Boolean active;
}
