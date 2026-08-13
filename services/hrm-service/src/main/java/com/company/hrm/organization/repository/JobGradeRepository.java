package com.company.hrm.organization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.hrm.organization.entity.JobGrade;

public interface JobGradeRepository extends JpaRepository<JobGrade, Long> {
}
