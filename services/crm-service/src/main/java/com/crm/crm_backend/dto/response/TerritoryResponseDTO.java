package com.crm.crm_backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TerritoryResponseDTO {

    private Long id;
    private String code;
    private String name;
    private String region;
    private String description;
    private String managerUsername;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
