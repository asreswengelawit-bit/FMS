package com.crm.crm_backend.integration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private String channel;
    private String recipient;
    private String subject;
    private String body;
    private boolean delivered;
}
