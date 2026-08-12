package com.crm.crm_backend.repository;

import com.crm.crm_backend.model.entity.CampaignMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignMetricsRepository extends JpaRepository<CampaignMetrics, Long> {

    List<CampaignMetrics> findByCampaignIdOrderByRecordedAtDesc(Long campaignId);

    Optional<CampaignMetrics> findFirstByCampaignIdOrderByRecordedAtDesc(Long campaignId);
}
