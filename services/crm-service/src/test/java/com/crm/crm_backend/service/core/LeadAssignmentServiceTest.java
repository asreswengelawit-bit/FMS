package com.crm.crm_backend.service.core;

import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.entity.LeadAssignmentCursor;
import com.crm.crm_backend.model.entity.Territory;
import com.crm.crm_backend.repository.LeadAssignmentCursorRepository;
import com.crm.crm_backend.repository.LeadRepository;
import com.crm.crm_backend.repository.TerritoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeadAssignmentServiceTest {

    @Mock
    private LeadRepository leadRepository;
    @Mock
    private TerritoryRepository territoryRepository;
    @Mock
    private LeadAssignmentCursorRepository cursorRepository;

    @InjectMocks
    private LeadAssignmentService leadAssignmentService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(leadAssignmentService, "enabled", true);
        ReflectionTestUtils.setField(leadAssignmentService, "officersCsv", "sales,officer2");
    }

    @Test
    void assignLead_usesTerritoryManagerWhenPresent() {
        Territory territory = Territory.builder()
                .id(5L)
                .code("ADD")
                .name("Addis")
                .managerUsername("territory.mgr")
                .active(true)
                .build();

        Lead lead = new Lead();
        lead.setId(1L);
        lead.setTerritory(territory);

        when(territoryRepository.findById(5L)).thenReturn(Optional.of(territory));
        when(leadRepository.save(any(Lead.class))).thenAnswer(inv -> inv.getArgument(0));

        boolean assigned = leadAssignmentService.assignLead(lead);

        assertThat(assigned).isTrue();
        assertThat(lead.getAssignedTo()).isEqualTo("territory.mgr");
        verify(leadRepository).save(lead);
        verify(cursorRepository, never()).findById(any());
    }

    @Test
    void assignLead_fallsBackToRoundRobinWhenNoTerritoryManager() {
        Lead lead = new Lead();
        lead.setId(2L);

        when(cursorRepository.findById((short) 1)).thenReturn(Optional.of(
                LeadAssignmentCursor.builder().id((short) 1).nextIndex(0).build()));
        when(cursorRepository.save(any(LeadAssignmentCursor.class))).thenAnswer(inv -> inv.getArgument(0));
        when(leadRepository.save(any(Lead.class))).thenAnswer(inv -> inv.getArgument(0));

        boolean assigned = leadAssignmentService.assignLead(lead);

        assertThat(assigned).isTrue();
        assertThat(lead.getAssignedTo()).isEqualTo("sales");

        ArgumentCaptor<LeadAssignmentCursor> cursorCaptor = ArgumentCaptor.forClass(LeadAssignmentCursor.class);
        verify(cursorRepository).save(cursorCaptor.capture());
        assertThat(cursorCaptor.getValue().getNextIndex()).isEqualTo(1L);
    }

    @Test
    void assignLead_skipsWhenAlreadyAssigned() {
        Lead lead = new Lead();
        lead.setId(3L);
        lead.setAssignedTo("already");

        boolean assigned = leadAssignmentService.assignLead(lead);

        assertThat(assigned).isFalse();
        verify(leadRepository, never()).save(any());
    }
}
