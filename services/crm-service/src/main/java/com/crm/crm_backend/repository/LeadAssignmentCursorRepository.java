package com.crm.crm_backend.repository;

import com.crm.crm_backend.model.entity.LeadAssignmentCursor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadAssignmentCursorRepository extends JpaRepository<LeadAssignmentCursor, Short> {
}
