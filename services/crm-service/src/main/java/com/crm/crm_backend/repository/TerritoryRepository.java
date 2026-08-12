package com.crm.crm_backend.repository;

import com.crm.crm_backend.model.entity.Territory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TerritoryRepository extends JpaRepository<Territory, Long> {

    Optional<Territory> findByCode(String code);

    boolean existsByCode(String code);

    List<Territory> findByActiveTrueOrderByNameAsc();

    List<Territory> findByRegionIgnoreCase(String region);
}
