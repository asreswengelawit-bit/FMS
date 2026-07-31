package com.company.hrm.recruitment.repository;

import com.company.hrm.recruitment.entity.JobPosting;
import com.company.hrm.recruitment.entity.JobPosting.EmploymentType;
import com.company.hrm.recruitment.entity.JobPosting.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    // Find all job postings by Department
    List<JobPosting> findByDepartmentId(Long departmentId);

    // Find all job postings by Position
    List<JobPosting> findByPositionId(Long positionId);

    // Find job postings by Status (OPEN, CLOSED, DRAFT)
    List<JobPosting> findByStatus(Status status);

    // Find job postings by Employment Type (FULL_TIME, PART_TIME, CONTRACT, INTERN)
    List<JobPosting> findByEmploymentType(EmploymentType employmentType);

    // Find all active job postings for career pages
    List<JobPosting> findByDepartmentIdAndStatus(Long departmentId, Status status);
}
