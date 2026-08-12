package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.CampaignCreateDTO;
import com.crm.crm_backend.dto.request.CampaignUpdateDTO;
import com.crm.crm_backend.dto.response.CampaignMetricsResponseDTO;
import com.crm.crm_backend.dto.response.CampaignMetricsSnapshotDTO;
import com.crm.crm_backend.dto.response.CampaignResponseDTO;
import com.crm.crm_backend.exception.CampaignExecutionException;
import com.crm.crm_backend.mapper.CampaignMapper;
import com.crm.crm_backend.model.entity.Campaign;
import com.crm.crm_backend.model.entity.CampaignMetrics;
import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.repository.CampaignMetricsRepository;
import com.crm.crm_backend.repository.CampaignRepository;
import com.crm.crm_backend.service.workflow.DomainStatusGuard;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignMetricsRepository campaignMetricsRepository;
    private final CampaignMapper campaignMapper;

    public CampaignResponseDTO createCampaign(CampaignCreateDTO dto) {

        Campaign campaign = campaignMapper.toEntity(dto);

        campaign.setCampaignNumber("CMP-" + System.currentTimeMillis());
        campaign.setStatus(CampaignStatus.PLANNED);
        campaign.setActualRevenue(BigDecimal.ZERO);
        campaign.setActualLeads(0);

        Campaign saved = campaignRepository.save(campaign);

        return campaignMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public CampaignResponseDTO getCampaign(Long id) {

        return campaignMapper.toResponseDTO(requireCampaign(id));
    }

    @Transactional(readOnly = true)
    public Page<CampaignResponseDTO> getAllCampaigns(Pageable pageable) {

        return campaignRepository.findAll(pageable)
                .map(campaignMapper::toResponseDTO);
    }

    public CampaignResponseDTO updateCampaign(Long id, CampaignUpdateDTO dto) {

        Campaign campaign = requireCampaign(id);
        campaignMapper.updateEntityFromDTO(dto, campaign);
        return campaignMapper.toResponseDTO(campaignRepository.save(campaign));
    }

    public CampaignResponseDTO activateCampaign(Long id) {
        return transition(id, CampaignStatus.ACTIVE);
    }

    public CampaignResponseDTO completeCampaign(Long id) {
        CampaignResponseDTO response = transition(id, CampaignStatus.COMPLETED);
        snapshotMetrics(id, "Completed campaign snapshot");
        return response;
    }

    public CampaignResponseDTO cancelCampaign(Long id) {
        return transition(id, CampaignStatus.CANCELLED);
    }

    /**
     * Increment actualLeads when a lead is attributed to this campaign.
     */
    public void recordLeadAttributed(Long campaignId) {
        if (campaignId == null) {
            return;
        }

        Campaign campaign = campaignRepository.findById(campaignId).orElse(null);
        if (campaign == null) {
            log.warn("Skipping lead attribution — campaign {} not found", campaignId);
            return;
        }

        if (campaign.getStatus() == CampaignStatus.CANCELLED
                || campaign.getStatus() == CampaignStatus.COMPLETED) {
            throw new CampaignExecutionException(
                    "Cannot attribute leads to campaign " + campaignId
                            + " in status " + campaign.getStatus());
        }

        int current = campaign.getActualLeads() != null ? campaign.getActualLeads() : 0;
        campaign.setActualLeads(current + 1);
        campaignRepository.save(campaign);
        log.info("Campaign {} actualLeads → {}", campaignId, campaign.getActualLeads());
    }

    /**
     * Add revenue when a campaign-attributed opportunity converts (CLOSED_WON).
     */
    public void recordRevenueFromConversion(Long campaignId, BigDecimal amount) {
        if (campaignId == null || amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        Campaign campaign = campaignRepository.findById(campaignId).orElse(null);
        if (campaign == null) {
            log.warn("Skipping revenue attribution — campaign {} not found", campaignId);
            return;
        }

        if (campaign.getStatus() == CampaignStatus.CANCELLED) {
            log.warn("Skipping revenue for cancelled campaign {}", campaignId);
            return;
        }

        BigDecimal current = campaign.getActualRevenue() != null
                ? campaign.getActualRevenue()
                : BigDecimal.ZERO;
        campaign.setActualRevenue(current.add(amount));
        campaignRepository.save(campaign);
        log.info("Campaign {} actualRevenue → {}", campaignId, campaign.getActualRevenue());
    }

    /**
     * Auto-activate PLANNED campaigns whose start date is today or earlier,
     * and auto-complete ACTIVE campaigns past their end date.
     */
    public void processScheduledTransitions() {
        LocalDate today = LocalDate.now();

        List<Campaign> planned = campaignRepository.findByStatus(CampaignStatus.PLANNED);
        for (Campaign campaign : planned) {
            if (campaign.getStartDate() != null && !campaign.getStartDate().isAfter(today)) {
                DomainStatusGuard.assertCampaignTransition(campaign.getStatus(), CampaignStatus.ACTIVE);
                campaign.setStatus(CampaignStatus.ACTIVE);
                campaignRepository.save(campaign);
                log.info("Scheduler activated campaign {}", campaign.getId());
            }
        }

        List<Campaign> active = campaignRepository.findByStatus(CampaignStatus.ACTIVE);
        for (Campaign campaign : active) {
            if (campaign.getEndDate() != null && campaign.getEndDate().isBefore(today)) {
                DomainStatusGuard.assertCampaignTransition(campaign.getStatus(), CampaignStatus.COMPLETED);
                campaign.setStatus(CampaignStatus.COMPLETED);
                campaignRepository.save(campaign);
                snapshotMetrics(campaign.getId(), "Scheduler completed campaign snapshot");
                log.info("Scheduler completed campaign {}", campaign.getId());
            }
        }
    }

    @Transactional(readOnly = true)
    public CampaignMetricsResponseDTO getCampaignMetrics(Long campaignId) {
        Campaign campaign = requireCampaign(campaignId);
        List<CampaignMetrics> snapshots =
                campaignMetricsRepository.findByCampaignIdOrderByRecordedAtDesc(campaignId);

        Integer expectedLeads = campaign.getExpectedLeads();
        Integer actualLeads = campaign.getActualLeads() != null ? campaign.getActualLeads() : 0;
        BigDecimal expectedRevenue = campaign.getExpectedRevenue() != null
                ? campaign.getExpectedRevenue() : BigDecimal.ZERO;
        BigDecimal actualRevenue = campaign.getActualRevenue() != null
                ? campaign.getActualRevenue() : BigDecimal.ZERO;

        Double leadRate = null;
        if (expectedLeads != null && expectedLeads > 0) {
            leadRate = (actualLeads * 100.0) / expectedLeads;
        }
        Double revenueRate = null;
        if (expectedRevenue.compareTo(BigDecimal.ZERO) > 0) {
            revenueRate = actualRevenue
                    .multiply(BigDecimal.valueOf(100))
                    .divide(expectedRevenue, 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return CampaignMetricsResponseDTO.builder()
                .campaignId(campaign.getId())
                .campaignNumber(campaign.getCampaignNumber())
                .campaignName(campaign.getCampaignName())
                .status(campaign.getStatus() != null ? campaign.getStatus().name() : null)
                .budget(campaign.getBudget())
                .expectedRevenue(expectedRevenue)
                .actualRevenue(actualRevenue)
                .expectedLeads(expectedLeads)
                .actualLeads(actualLeads)
                .leadAchievementRate(leadRate)
                .revenueAchievementRate(revenueRate)
                .latestSnapshotAt(snapshots.isEmpty() ? null : snapshots.getFirst().getRecordedAt())
                .snapshots(snapshots.stream().map(this::toSnapshotDto).toList())
                .build();
    }

    public CampaignMetricsSnapshotDTO snapshotMetrics(Long campaignId, String notes) {
        Campaign campaign = requireCampaign(campaignId);
        CampaignMetrics metrics = CampaignMetrics.builder()
                .campaign(campaign)
                .recordedAt(LocalDateTime.now())
                .statusSnapshot(campaign.getStatus() != null ? campaign.getStatus().name() : null)
                .budget(campaign.getBudget())
                .expectedRevenue(campaign.getExpectedRevenue())
                .actualRevenue(campaign.getActualRevenue())
                .expectedLeads(campaign.getExpectedLeads())
                .actualLeads(campaign.getActualLeads())
                .notes(notes)
                .build();
        CampaignMetrics saved = campaignMetricsRepository.save(metrics);
        log.info("Campaign {} metrics snapshot {}", campaignId, saved.getId());
        return toSnapshotDto(saved);
    }

    public void deleteCampaign(Long id) {

        Campaign campaign = requireCampaign(id);

        if (campaign.getStatus() == CampaignStatus.ACTIVE) {
            throw new CampaignExecutionException(
                    "Cannot delete an ACTIVE campaign. Cancel or complete it first.");
        }

        campaignRepository.delete(campaign);
        log.info("Campaign {} deleted", id);
    }

    private CampaignResponseDTO transition(Long id, CampaignStatus target) {
        Campaign campaign = requireCampaign(id);
        DomainStatusGuard.assertCampaignTransition(campaign.getStatus(), target);
        campaign.setStatus(target);
        Campaign saved = campaignRepository.save(campaign);
        log.info("Campaign {} → {}", id, target);
        return campaignMapper.toResponseDTO(saved);
    }

    private Campaign requireCampaign(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new CampaignExecutionException("Campaign not found: " + id));
    }

    private CampaignMetricsSnapshotDTO toSnapshotDto(CampaignMetrics metrics) {
        return CampaignMetricsSnapshotDTO.builder()
                .id(metrics.getId())
                .recordedAt(metrics.getRecordedAt())
                .statusSnapshot(metrics.getStatusSnapshot())
                .budget(metrics.getBudget())
                .expectedRevenue(metrics.getExpectedRevenue())
                .actualRevenue(metrics.getActualRevenue())
                .expectedLeads(metrics.getExpectedLeads())
                .actualLeads(metrics.getActualLeads())
                .notes(metrics.getNotes())
                .build();
    }
}
