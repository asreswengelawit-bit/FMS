package com.HumanResourceManagement.Organization.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HumanResourceManagement.Organization.Model.Branch;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByOrganizationId(Long organizationId);
}
