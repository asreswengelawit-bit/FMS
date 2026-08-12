package com.crm.crm_backend.repository;

import com.crm.crm_backend.model.entity.CustomerSegment;
import com.crm.crm_backend.model.enums.SegmentCriteriaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerSegmentRepository
        extends JpaRepository<CustomerSegment, Long> {

    Optional<CustomerSegment> findBySegmentNumber(String segmentNumber);

    boolean existsBySegmentNumber(String segmentNumber);

    List<CustomerSegment> findByCriteriaType(SegmentCriteriaType criteriaType);

    List<CustomerSegment> findByActive(Boolean active);
}
