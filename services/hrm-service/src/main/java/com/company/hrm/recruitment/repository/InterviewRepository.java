package com.company.hrm.recruitment.repository;

import com.company.hrm.recruitment.entity.Interview;
import com.company.hrm.recruitment.entity.Interview.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    // Find all interviews for a given Job Application
    List<Interview> findByJobApplicationId(Long jobApplicationId);

    // Find all interviews assigned to a specific Employee
    List<Interview> findByInterviewerId(Long interviewerId);

    // Find interviews filtered by status (SCHEDULED, COMPLETED, CANCELLED)
    List<Interview> findByStatus(Status status);
}
