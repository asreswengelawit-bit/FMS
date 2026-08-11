package com.crm.crm_backend.scheduler;

import com.crm.crm_backend.service.core.LeadAssignmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LeadAssignmentScheduler {

    private final LeadAssignmentService leadAssignmentService;

    @Scheduled(cron = "${crm.scheduler.lead-assignment.cron:0 */5 * * * *}")
    public void assignUnassignedLeads() {
        log.debug("Running lead auto-assignment scheduler");
        leadAssignmentService.assignUnassignedLeads();
    }
}
