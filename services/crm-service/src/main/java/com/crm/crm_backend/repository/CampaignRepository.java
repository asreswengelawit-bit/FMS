package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.Campaign;
import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.model.enums.CampaignType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    long count();

    long countByStatus(CampaignStatus status);
    Optional<Campaign> findByCampaignNumber(String campaignNumber);

    boolean existsByCampaignNumber(String campaignNumber);

    List<Campaign> findByStatus(CampaignStatus status);

    List<Campaign> findByCampaignType(CampaignType campaignType);
}