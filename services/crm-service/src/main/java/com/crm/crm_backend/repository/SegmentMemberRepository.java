package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.SegmentMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SegmentMemberRepository
        extends JpaRepository<SegmentMember, Long> {

    List<SegmentMember> findBySegmentId(Long segmentId);

    List<SegmentMember> findByCustomerId(Long customerId);

    boolean existsBySegmentIdAndCustomerId(Long segmentId, Long customerId);

    Optional<SegmentMember> findBySegmentIdAndCustomerId(Long segmentId, Long customerId);

    void deleteBySegmentId(Long segmentId);

    long countBySegmentId(Long segmentId);
}