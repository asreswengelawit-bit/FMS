package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.model.enums.QuotationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends
        JpaRepository<Quotation, Long>,
        JpaSpecificationExecutor<Quotation> {

    Optional<Quotation> findByQuotationNumber(String quotationNumber);

    boolean existsByQuotationNumber(String quotationNumber);

    List<Quotation> findByStatus(QuotationStatus status);

    long countByStatus(QuotationStatus status);

    List<Quotation> findByOpportunityIdAndStatusIn(Long opportunityId, List<QuotationStatus> statuses);
}
