package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.Interaction;
import com.crm.crm_backend.model.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {

    List<Interaction> findByCustomerId(Long customerId);

    List<Interaction> findByLeadId(Long leadId);

    List<Interaction> findByOpportunityId(Long opportunityId);

    List<Interaction> findByInteractionType(InteractionType interactionType);

    List<Interaction> findByCompleted(Boolean completed);
}