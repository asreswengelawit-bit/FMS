package com.company.hrm.organization.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.hrm.organization.entity.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByOrganizationId(Long organizationId);
}
