package com.company.mms.requisition;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RequisitionRepository extends JpaRepository<Requisition, String> {

    @Query("SELECT r FROM Requisition r WHERE "
            + "(:status IS NULL OR LOWER(r.status) = LOWER(:status)) AND "
            + "(:department IS NULL OR LOWER(r.department) = LOWER(:department)) "
            + "ORDER BY r.createdAt DESC")
    List<Requisition> search(
            @Param("status") String status,
            @Param("department") String department);
}
