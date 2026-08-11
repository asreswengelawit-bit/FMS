package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.Opportunity;
import com.crm.crm_backend.model.enums.OpportunityStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    long count();

    long countByStage(OpportunityStage stage);
    Optional<Opportunity> findByOpportunityNumber(String opportunityNumber);

    boolean existsByOpportunityNumber(String opportunityNumber);

    List<Opportunity> findByStage(OpportunityStage stage);

    List<Opportunity> findByAssignedTo(String assignedTo);
}