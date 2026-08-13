package com.company.mms.item;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {

    List<Material> findAllByOrderByNameAsc();

    Optional<Material> findFirstByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
