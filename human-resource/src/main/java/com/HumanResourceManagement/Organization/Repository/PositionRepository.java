package com.HumanResourceManagement.Organization.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

// import com.HumanResourceManagement.Organization.Model.Branch;
import com.HumanResourceManagement.Organization.Model.Position;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByDepartmentId(Long departmentId);

}
