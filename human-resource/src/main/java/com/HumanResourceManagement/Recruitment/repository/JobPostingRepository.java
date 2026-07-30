package com.HumanResourceManagement.Recruitment.repository;

import com.HumanResourceManagement.Recruitment.Model.JobPosting;
import com.HumanResourceManagement.Recruitment.Model.JobPosting.EmploymentType;
import com.HumanResourceManagement.Recruitment.Model.JobPosting.Status;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

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