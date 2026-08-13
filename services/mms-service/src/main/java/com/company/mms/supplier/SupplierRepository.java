package com.company.mms.supplier;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, String> {

    List<Supplier> findAllByOrderByNameAsc();

    List<Supplier> findByStatusOrderByNameAsc(String status);

    Optional<Supplier> findByEmailIgnoreCase(String email);
}
