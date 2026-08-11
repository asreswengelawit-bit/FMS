package com.crm.crm_backend.notification.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${crm.notification.email.from:crm-noreply@insa.local}")
    private String fromAddress;

    @Value("${crm.notification.email.enabled:true}")
    private boolean enabled;

    /**
     * When true and SMTP is not configured, fall back to log transport (dev only).
     * Production should set this false so missing SMTP fails loudly.
     */
    @Value("${crm.notification.email.allow-log-fallback:true}")
    private boolean allowLogFallback;

    public boolean send(String to, String subject, String body) {
        if (!enabled) {
            log.info("Email disabled — would send to={} subject={}", to, subject);
            return false;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            if (allowLogFallback) {
                log.info("EMAIL SENT (log transport) to={} subject={} body={}", to, subject, body);
                return true;
            }
            log.error("EMAIL FAILED — SMTP not configured (spring.mail.host) and log fallback disabled");
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("EMAIL SENT via SMTP to={} subject={}", to, subject);
            return true;
        } catch (Exception ex) {
            log.error("EMAIL FAILED to={} subject={}: {}", to, subject, ex.getMessage());
            if (allowLogFallback) {
                log.info("EMAIL FALLBACK (log transport) to={} subject={} body={}", to, subject, body);
                return true;
            }
            return false;
        }
    }
}
