package com.company.hrm.organization.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.hrm.organization.entity.Position;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByDepartmentId(Long departmentId);

}
