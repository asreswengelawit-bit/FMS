package com.HumanResourceManagement.Recruitment.repository;

import com.HumanResourceManagement.Recruitment.Model.Candidate;
import com.HumanResourceManagement.Recruitment.Model.Candidate.Source;
import com.HumanResourceManagement.Recruitment.Model.Candidate.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    // Find candidate by unique email
    Optional<Candidate> findByEmail(String email);

    // Check if a candidate email already exists (useful for validation before
    // creation)
    boolean existsByEmail(String email);

    // Find candidates by Recruitment Status (NEW, IN_PROCESS, HIRED, REJECTED)
    List<Candidate> findByStatus(Status status);

    // Find candidates by Source (REFERRAL, JOB_BOARD, WEBSITE, AGENCY)
    List<Candidate> findBySource(Source source);
}