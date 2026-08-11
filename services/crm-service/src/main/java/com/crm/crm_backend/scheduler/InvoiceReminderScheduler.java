package com.crm.crm_backend.scheduler;

import com.crm.crm_backend.service.core.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceReminderScheduler {

    private final InvoiceService invoiceService;

    @Scheduled(cron = "${crm.scheduler.invoice-reminder.cron:0 30 8 * * *}")
    public void processOverdueInvoices() {
        log.debug("Running invoice overdue/reminder scheduler");
        invoiceService.processOverdueAndReminders();
    }
}
