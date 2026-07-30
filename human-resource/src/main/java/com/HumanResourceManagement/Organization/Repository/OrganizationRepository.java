package com.HumanResourceManagement.Organization.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

import com.HumanResourceManagement.Organization.Model.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
