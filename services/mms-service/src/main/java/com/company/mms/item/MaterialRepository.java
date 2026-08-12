package com.company.mms.item;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {

    @Query("SELECT m FROM Material m WHERE "
            + "(:active IS NULL OR m.active = :active) AND "
            + "(:category IS NULL OR LOWER(m.category) = LOWER(:category)) AND "
            + "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(m.id) LIKE LOWER(CONCAT('%', :search, '%'))) "
            + "ORDER BY m.name ASC")
    List<Material> search(
            @Param("active") Boolean active,
            @Param("category") String category,
            @Param("search") String search);

    Optional<Material> findFirstByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
