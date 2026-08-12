package com.crm.crm_backend.service.integration;

import com.crm.crm_backend.event.dto.DomainEventMessage;
import com.crm.crm_backend.notification.NotificationService.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Integration facade used by other modules that should not depend on the
 * notification package directly.
 */
@Service
@RequiredArgsConstructor
public class NotificationIntegrationService {

    private final NotificationService notificationService;

    public void processEvent(DomainEventMessage event) {
        notificationService.handleDomainEvent(event);
    }
}
