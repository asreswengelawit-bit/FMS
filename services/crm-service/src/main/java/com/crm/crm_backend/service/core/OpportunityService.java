package com.crm.crm_backend.service.core;


import com.crm.crm_backend.dto.request.OpportunityCreateDTO;
import com.crm.crm_backend.dto.request.OpportunityUpdateDTO;
import com.crm.crm_backend.dto.response.OpportunityResponseDTO;
import com.crm.crm_backend.exception.OpportunityNotFoundException;
import com.crm.crm_backend.mapper.OpportunityMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.entity.Opportunity;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.LeadRepository;
import com.crm.crm_backend.repository.OpportunityRepository;
import com.crm.crm_backend.service.workflow.DomainStatusGuard;
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
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final OpportunityMapper opportunityMapper;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final CampaignService campaignService;
    private final QuotationService quotationService;

    public OpportunityResponseDTO createOpportunity(OpportunityCreateDTO dto) {

        Lead lead = leadRepository.findById(dto.getLeadId())
                .orElseThrow(() ->
                        new RuntimeException("Lead not found."));

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        Opportunity opportunity = opportunityMapper.toEntity(dto);

        opportunity.setLead(lead);
        opportunity.setCustomer(customer);
        opportunity.setStage(OpportunityStage.NEW);

        opportunity.setOpportunityNumber(
                "OPP-" + System.currentTimeMillis()
        );

        Opportunity saved = opportunityRepository.save(opportunity);

        return opportunityMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public OpportunityResponseDTO getOpportunityById(Long id) {

        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() ->
                        new OpportunityNotFoundException(
                                "Opportunity not found : " + id));

        return opportunityMapper.toResponseDTO(opportunity);
    }

    @Transactional(readOnly = true)
    public Page<OpportunityResponseDTO> getAllOpportunities(Pageable pageable) {

        return opportunityRepository.findAll(pageable)
                .map(opportunityMapper::toResponseDTO);
    }

    public OpportunityResponseDTO updateOpportunity(Long id,
                                                    OpportunityUpdateDTO dto) {

        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() ->
                        new OpportunityNotFoundException(
                                "Opportunity not found : " + id));

        opportunityMapper.updateEntityFromDTO(dto, opportunity);

        Opportunity updated = opportunityRepository.save(opportunity);

        return opportunityMapper.toResponseDTO(updated);
    }

    public void deleteOpportunity(Long id) {

        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() ->
                        new OpportunityNotFoundException(
                                "Opportunity not found : " + id));

        opportunityRepository.delete(opportunity);

        log.info("Opportunity deleted {}", id);
    }

    public OpportunityResponseDTO updateStage(Long id,
                                              OpportunityStage stage) {

        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() ->
                        new OpportunityNotFoundException(
                                "Opportunity not found : " + id));

        DomainStatusGuard.assertOpportunityTransition(opportunity.getStage(), stage);

        opportunity.setStage(stage);

        if (stage == OpportunityStage.CLOSED_WON || stage == OpportunityStage.CLOSED_LOST) {
            opportunity.setActualCloseDate(java.time.LocalDate.now());
        }

        Opportunity updated = opportunityRepository.save(opportunity);

        if (stage == OpportunityStage.CLOSED_WON || stage == OpportunityStage.CLOSED_LOST) {
            boolean won = stage == OpportunityStage.CLOSED_WON;
            quotationService.closeOpenQuotationsForOpportunity(updated.getId(), won);

            if (won) {
                Lead lead = updated.getLead();
                if (lead != null && lead.getCampaignId() != null) {
                    java.math.BigDecimal revenue = updated.getExpectedRevenue() != null
                            ? updated.getExpectedRevenue()
                            : java.math.BigDecimal.ZERO;
                    campaignService.recordRevenueFromConversion(lead.getCampaignId(), revenue);
                }
            }
        }

        return opportunityMapper.toResponseDTO(updated);
    }

}