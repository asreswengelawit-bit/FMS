package com.crm.crm_backend.repository;

// repository/LeadRepository.java

import com.crm.crm_backend.model.entity.Lead;
import com.crm.crm_backend.model.enums.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long>,
        JpaSpecificationExecutor<Lead> {
    Page<Lead> findByDeletedFalse(Pageable pageable);

    Optional<Lead> findByIdAndDeletedFalse(Long id);

    boolean existsByEmail(String email);

    Optional<Lead> findByEmail(String email);

    List<Lead> findByStatus(LeadStatus status);

    List<Lead> findByAssignedTo(String assignedTo);

    List<Lead> findByStatusAndAssignedTo(LeadStatus status, String assignedTo);

    @Query("""
            select l from Lead l
            where l.deleted = false
              and l.status = :status
              and (l.assignedTo is null or trim(l.assignedTo) = '')
            """)
    List<Lead> findUnassignedByStatus(@Param("status") LeadStatus status);

    long count();
    long countByStatus(LeadStatus status);
}
