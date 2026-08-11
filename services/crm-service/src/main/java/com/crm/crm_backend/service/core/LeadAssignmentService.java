package com.crm.crm_backend.service.core;

import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.entity.LeadAssignmentCursor;
import com.crm.crm_backend.model.entity.Territory;
import com.crm.crm_backend.model.enums.LeadStatus;
import com.crm.crm_backend.repository.LeadAssignmentCursorRepository;
import com.crm.crm_backend.repository.LeadRepository;
import com.crm.crm_backend.repository.TerritoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeadAssignmentService {

    private static final short CURSOR_ID = 1;

    private final LeadRepository leadRepository;
    private final TerritoryRepository territoryRepository;
    private final LeadAssignmentCursorRepository cursorRepository;

    @Value("${crm.lead.assignment.officers:sales}")
    private String officersCsv;

    @Value("${crm.lead.assignment.enabled:true}")
    private boolean enabled;

    /**
     * Assign a single lead: territory manager first, else round-robin officers.
     */
    @Transactional
    public boolean assignLead(Lead lead) {
        if (!enabled || lead == null) {
            return false;
        }
        if (lead.getAssignedTo() != null && !lead.getAssignedTo().isBlank()) {
            return false;
        }

        String assignee = resolveTerritoryManager(lead);
        if (assignee == null) {
            assignee = nextRoundRobinOfficer();
        }
        if (assignee == null || assignee.isBlank()) {
            log.warn("No sales officers configured for lead assignment");
            return false;
        }

        lead.setAssignedTo(assignee.trim());
        leadRepository.save(lead);
        log.info("Assigned lead {} to {}", lead.getId(), assignee);
        return true;
    }

    /**
     * Batch: assign all NEW leads with blank assignedTo.
     */
    @Transactional
    public int assignUnassignedLeads() {
        if (!enabled) {
            return 0;
        }
        List<Lead> unassigned = leadRepository.findUnassignedByStatus(LeadStatus.NEW);
        int count = 0;
        for (Lead lead : unassigned) {
            if (assignLead(lead)) {
                count++;
            }
        }
        if (count > 0) {
            log.info("Auto-assigned {} unassigned NEW leads", count);
        }
        return count;
    }

    private String resolveTerritoryManager(Lead lead) {
        if (lead.getTerritory() == null || lead.getTerritory().getId() == null) {
            return null;
        }
        Territory territory = territoryRepository.findById(lead.getTerritory().getId()).orElse(null);
        if (territory == null || !Boolean.TRUE.equals(territory.getActive())) {
            return null;
        }
        String manager = territory.getManagerUsername();
        if (manager == null || manager.isBlank()) {
            return null;
        }
        return manager.trim();
    }

    private String nextRoundRobinOfficer() {
        List<String> officers = Arrays.stream(officersCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        if (officers.isEmpty()) {
            return null;
        }

        LeadAssignmentCursor cursor = cursorRepository.findById(CURSOR_ID)
                .orElseGet(() -> cursorRepository.save(LeadAssignmentCursor.builder()
                        .id(CURSOR_ID)
                        .nextIndex(0)
                        .build()));

        long index = cursor.getNextIndex();
        String officer = officers.get((int) (Math.floorMod(index, officers.size())));
        cursor.setNextIndex(index + 1);
        cursorRepository.save(cursor);
        return officer;
    }
}
