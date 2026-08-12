package com.crm.crm_backend.repository;

import com.crm.crm_backend.model.entity.PricingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PricingRuleRepository extends JpaRepository<PricingRule, Long> {

    Optional<PricingRule> findByCode(String code);

    boolean existsByCode(String code);

    List<PricingRule> findByActiveTrueOrderByPriorityAsc();
}
