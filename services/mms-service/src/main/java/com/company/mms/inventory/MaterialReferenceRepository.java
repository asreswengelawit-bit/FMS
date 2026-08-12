package com.company.mms.inventory;

import java.util.Optional;

import org.springframework.data.repository.Repository;

public interface MaterialReferenceRepository extends Repository<MaterialReference, String> {

    Optional<MaterialReference> findById(String id);

    Optional<MaterialReference> findFirstByNameIgnoreCase(String name);
}
