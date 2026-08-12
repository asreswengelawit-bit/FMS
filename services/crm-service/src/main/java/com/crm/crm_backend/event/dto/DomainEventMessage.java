package com.crm.crm_backend.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainEventMessage {

    private String eventName;
    private String source;
    private LocalDateTime occurredAt;
    private Map<String, Object> data;
}
