package com.HumanResourceManagement.Organization.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HumanResourceManagement.Organization.Model.JobGrade;

public interface JobGradeRepository extends JpaRepository<JobGrade, Long> {
}
