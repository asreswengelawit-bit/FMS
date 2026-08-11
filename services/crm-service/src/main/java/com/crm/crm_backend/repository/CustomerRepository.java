package com.crm.crm_backend.repository;

// repository/CustomerRepository.java

import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.enums.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>,
        JpaSpecificationExecutor<Customer> {
    Page<Customer> findByDeletedFalse(Pageable pageable);

    Optional<Customer> findByIdAndDeletedFalse(Long id);

    long count();

    long countByDeletedFalse();

    long countByStatusAndDeletedFalse(CustomerStatus status);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByCustomerNumber(String customerNumber);

    @Query("select max(c.customerNumber) from Customer c where c.customerNumber like concat(:prefix, '%')")
    Optional<String> findMaxCustomerNumberStartingWith(@Param("prefix") String prefix);

    List<Customer> findByStatus(CustomerStatus status);

    List<Customer> findByCompanyNameContainingIgnoreCase(String companyName);

    boolean existsByEmail(String email);

    boolean existsByCustomerNumber(String customerNumber);
}