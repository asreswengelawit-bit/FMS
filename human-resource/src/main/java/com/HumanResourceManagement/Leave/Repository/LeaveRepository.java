package com.HumanResourceManagement.Leave.Repository;

import com.HumanResourceManagement.Leave.Model.Leave;
import com.HumanResourceManagement.Leave.Model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    // GET /employees/{employeeId}/leave-requests
    List<Leave> findByEmployeeId(Long employeeId);

    // GET /leave-requests?status=PENDING
    List<Leave> findByStatus(LeaveStatus status);

    // Useful for a manager's approval queue: this employee's requests in a given
    // state
    List<Leave> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);

    // Overlap check — used by the service before creating/approving a request,
    // so an employee can't have two APPROVED/PENDING leaves covering the same days
    @Query("""
                SELECT l FROM Leave l
                WHERE l.employee.id = :employeeId
                AND l.status IN ('PENDING', 'APPROVED')
                AND l.startDate <= :endDate
                AND l.endDate >= :startDate
            """)
    List<Leave> findOverlappingLeaves(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
