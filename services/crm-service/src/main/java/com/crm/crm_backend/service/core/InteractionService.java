package com.crm.crm_backend.service.core;


import com.crm.crm_backend.dto.request.InteractionCreateDTO;
import com.crm.crm_backend.dto.request.InteractionUpdateDTO;
import com.crm.crm_backend.dto.response.InteractionResponseDTO;
import com.crm.crm_backend.mapper.InteractionMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Interaction;
import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.entity.Opportunity;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.InteractionRepository;
import com.crm.crm_backend.repository.LeadRepository;
import com.crm.crm_backend.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final OpportunityRepository opportunityRepository;
    private final InteractionMapper interactionMapper;

    public InteractionResponseDTO createInteraction(InteractionCreateDTO dto) {

        Interaction interaction = interactionMapper.toEntity(dto);

        if (dto.getCustomerId() != null) {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            interaction.setCustomer(customer);
        }

        if (dto.getLeadId() != null) {
            Lead lead = leadRepository.findById(dto.getLeadId())
                    .orElseThrow(() -> new RuntimeException("Lead not found"));
            interaction.setLead(lead);
        }

        if (dto.getOpportunityId() != null) {
            Opportunity opportunity = opportunityRepository.findById(dto.getOpportunityId())
                    .orElseThrow(() -> new RuntimeException("Opportunity not found"));
            interaction.setOpportunity(opportunity);
        }

        interaction.setInteractionNumber("INT-" + System.currentTimeMillis());

        Interaction saved = interactionRepository.save(interaction);

        return interactionMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public InteractionResponseDTO getInteraction(Long id) {

        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interaction not found"));

        return interactionMapper.toResponseDTO(interaction);
    }

    @Transactional(readOnly = true)
    public Page<InteractionResponseDTO> getAllInteractions(Pageable pageable) {

        return interactionRepository.findAll(pageable)
                .map(interactionMapper::toResponseDTO);
    }

    public InteractionResponseDTO updateInteraction(Long id,
                                                    InteractionUpdateDTO dto) {

        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interaction not found"));

        interactionMapper.updateEntityFromDTO(dto, interaction);

        Interaction updated = interactionRepository.save(interaction);

        return interactionMapper.toResponseDTO(updated);
    }

    public void deleteInteraction(Long id) {

        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interaction not found"));

        interactionRepository.delete(interaction);

        log.info("Interaction {} deleted", id);
    }
}