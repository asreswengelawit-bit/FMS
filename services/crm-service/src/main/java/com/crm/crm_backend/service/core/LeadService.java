package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.CustomerCreateDTO;
import com.crm.crm_backend.dto.request.LeadConvertDTO;
import com.crm.crm_backend.dto.request.LeadCreateDTO;
import com.crm.crm_backend.dto.request.LeadUpdateDTO;
import com.crm.crm_backend.dto.request.OpportunityCreateDTO;
import com.crm.crm_backend.dto.response.CustomerResponseDTO;
import com.crm.crm_backend.dto.response.LeadResponseDTO;
import com.crm.crm_backend.dto.response.OpportunityResponseDTO;
import com.crm.crm_backend.event.publisher.LeadEventPublisher;
import com.crm.crm_backend.exception.LeadNotFoundException;
import com.crm.crm_backend.mapper.LeadMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.enums.CustomerType;
import com.crm.crm_backend.model.enums.LeadStatus;
import com.crm.crm_backend.model.enums.OpportunityType;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.LeadRepository;
import com.crm.crm_backend.repository.TerritoryRepository;
import com.crm.crm_backend.service.workflow.DomainStatusGuard;
import com.crm.crm_backend.spec.LeadSpecification;
import com.crm.crm_backend.util.calculator.LeadScoreCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadMapper leadMapper;
    private final CustomerService customerService;
    private final CustomerRepository customerRepository;
    private final OpportunityService opportunityService;
    private final CampaignService campaignService;
    private final LeadScoreCalculator leadScoreCalculator;
    private final LeadEventPublisher leadEventPublisher;
    private final com.crm.crm_backend.validator.LeadValidator leadValidator;
    private final LeadAssignmentService leadAssignmentService;
    private final TerritoryRepository territoryRepository;

    @Transactional
    public LeadResponseDTO createLead(LeadCreateDTO dto) {

        log.info("Creating lead {}", dto.getEmail());

        leadValidator.validateCreate(dto);

        if (dto.getEmail() != null &&
                leadRepository.existsByEmail(dto.getEmail())) {

            throw new RuntimeException("Lead email already exists.");
        }

        Lead lead = leadMapper.toEntity(dto);
        applyTerritory(lead, dto.getTerritoryId());

        lead.setStatus(LeadStatus.NEW);

        lead.setLeadScore(
                leadScoreCalculator.calculate(lead)
        );

        Lead saved = leadRepository.save(lead);

        if (saved.getAssignedTo() == null || saved.getAssignedTo().isBlank()) {
            leadAssignmentService.assignLead(saved);
        }

        if (saved.getCampaignId() != null) {
            campaignService.recordLeadAttributed(saved.getCampaignId());
        }

        leadEventPublisher.publishLeadCreated(saved);

        return leadMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public LeadResponseDTO getLeadById(Long id) {

        Lead lead = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new LeadNotFoundException(
                                "Lead not found : " + id));

        return leadMapper.toResponseDTO(lead);
    }

    @Transactional(readOnly = true)
    public Page<LeadResponseDTO> getAllLeads(Pageable pageable) {
        return searchLeads(null, null, null, null, null, null, null, pageable);
    }

    @Transactional(readOnly = true)
    public Page<LeadResponseDTO> searchLeads(
            String q,
            LeadStatus status,
            String assignedTo,
            Long territoryId,
            Long campaignId,
            LocalDate createdFrom,
            LocalDate createdTo,
            Pageable pageable) {

        Specification<Lead> spec = LeadSpecification.withFilters(
                q, status, assignedTo, territoryId, campaignId, createdFrom, createdTo);
        return leadRepository.findAll(spec, pageable).map(leadMapper::toResponseDTO);
    }

    @Transactional
    public LeadResponseDTO updateLead(Long id,
                                      LeadUpdateDTO dto) {

        Lead lead = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new LeadNotFoundException(
                                "Lead not found : " + id));

        leadValidator.validateUpdate(lead, dto);

        leadMapper.updateEntityFromDTO(dto, lead);
        if (dto.getTerritoryId() != null) {
            applyTerritory(lead, dto.getTerritoryId());
        }

        lead.setLeadScore(
                leadScoreCalculator.calculate(lead)
        );

        Lead updated = leadRepository.save(lead);

        return leadMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deleteLead(Long id) {

        Lead lead = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new LeadNotFoundException(
                                "Lead not found : " + id));

        if (lead.getStatus() == LeadStatus.CONVERTED) {
            throw new IllegalStateException("Cannot delete a converted lead");
        }

        lead.setDeleted(true);
        leadRepository.save(lead);

        log.info("Lead soft-deleted {}", id);
    }

    @Transactional
    public LeadResponseDTO updateLeadStatus(Long id,
                                            LeadStatus newStatus) {

        Lead lead = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new LeadNotFoundException(
                                "Lead not found : " + id));

        DomainStatusGuard.assertLeadTransition(lead.getStatus(), newStatus);

        lead.setStatus(newStatus);

        if (newStatus == LeadStatus.QUALIFIED) {

            lead.setLeadScore(
                    leadScoreCalculator.calculate(lead));

            leadEventPublisher.publishLeadQualified(lead);
        }

        Lead updated = leadRepository.save(lead);

        return leadMapper.toResponseDTO(updated);
    }

    @Transactional
    public LeadResponseDTO convertLeadToCustomer(Long id,
                                                 LeadConvertDTO dto) {

        Lead lead = leadRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new LeadNotFoundException(
                                "Lead not found : " + id));

        leadValidator.validateCanConvert(lead);

        DomainStatusGuard.assertLeadTransition(lead.getStatus(), LeadStatus.CONVERTED);

        CustomerCreateDTO customerDTO =
                buildCustomerFromLead(lead);

        CustomerResponseDTO customerDto =
                customerService.createCustomer(customerDTO);

        Customer customer = customerRepository.findById(customerDto.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Created customer not found: " + customerDto.getId()));

        lead.setConvertedCustomer(customer);
        lead.setStatus(LeadStatus.CONVERTED);
        lead.setConvertedAt(LocalDateTime.now());
        lead.setConversionReason(dto.getConversionReason());

        if (dto.isCreateOpportunity()) {
            OpportunityCreateDTO opportunityCreateDTO = new OpportunityCreateDTO();
            opportunityCreateDTO.setLeadId(lead.getId());
            opportunityCreateDTO.setCustomerId(customer.getId());
            opportunityCreateDTO.setOpportunityName(
                    dto.getOpportunityTitle() != null && !dto.getOpportunityTitle().isBlank()
                            ? dto.getOpportunityTitle()
                            : "Opportunity from lead " + lead.getId());
            opportunityCreateDTO.setType(OpportunityType.NEW_BUSINESS);
            opportunityCreateDTO.setExpectedRevenue(
                    dto.getOpportunityValue() != null
                            ? BigDecimal.valueOf(dto.getOpportunityValue())
                            : lead.getBudget());
            opportunityCreateDTO.setProbability(50);
            opportunityCreateDTO.setDescription("Auto-created during lead conversion");

            OpportunityResponseDTO opportunity =
                    opportunityService.createOpportunity(opportunityCreateDTO);
            lead.setConvertedOpportunityId(opportunity.getId());
        }

        Lead converted = leadRepository.save(lead);

        leadEventPublisher.publishLeadConverted(converted);

        log.info("Lead {} converted to customer {} (opportunityId={})",
                id, customer.getId(), lead.getConvertedOpportunityId());

        return leadMapper.toResponseDTO(converted);
    }

    private CustomerCreateDTO buildCustomerFromLead(Lead lead) {

        CustomerCreateDTO dto =
                new CustomerCreateDTO();

        dto.setCustomerName(
                lead.getFirstName() + " " + lead.getLastName());

        dto.setOrganizationName(
                lead.getCompany());

        dto.setCustomerType(
                CustomerType.ORGANIZATION);

        dto.setEmail(
                lead.getEmail());

        dto.setPhone(
                lead.getPhone());

        dto.setIndustry(
                lead.getIndustry());

        if (lead.getTerritory() != null) {
            dto.setTerritoryId(lead.getTerritory().getId());
        }

        return dto;
    }

    private void applyTerritory(Lead lead, Long territoryId) {
        if (territoryId == null) {
            return;
        }
        lead.setTerritory(territoryRepository.findById(territoryId)
                .orElseThrow(() -> new IllegalArgumentException("Territory not found: " + territoryId)));
    }
}
