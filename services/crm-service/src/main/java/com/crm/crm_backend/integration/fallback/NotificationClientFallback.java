package com.crm.crm_backend.integration.fallback;

import com.crm.crm_backend.integration.dto.NotificationDTO;
import com.crm.crm_backend.notification.EmailService.EmailService;
import com.crm.crm_backend.notification.SmsService.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationClientFallback {

    private final EmailService emailService;
    private final SmsService smsService;

    public NotificationDTO dispatchEmail(String recipient, String subject, String body) {
        boolean delivered = emailService.send(recipient, subject, body);
        return NotificationDTO.builder()
                .channel("EMAIL")
                .recipient(recipient)
                .subject(subject)
                .body(body)
                .delivered(delivered)
                .build();
    }

    public NotificationDTO dispatchSms(String recipient, String body) {
        boolean delivered = smsService.send(recipient, body);
        return NotificationDTO.builder()
                .channel("SMS")
                .recipient(recipient)
                .body(body)
                .delivered(delivered)
                .build();
    }
}
