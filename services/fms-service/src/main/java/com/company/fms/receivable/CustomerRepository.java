package com.company.fms.receivable;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    Optional<Customer> findByCustomerCode(String customerCode);

    List<Customer> findAllByOrderByCustomerNameAsc();

    Page<Customer> findAllByOrderByCustomerNameAsc(Pageable pageable);

    Page<Customer> findByStatusOrderByCustomerNameAsc(String status, Pageable pageable);

    Page<Customer> findByCustomerNameContainingIgnoreCaseOrCustomerCodeContainingIgnoreCaseOrderByCustomerNameAsc(
            String name, String code, Pageable pageable);

    Page<Customer> findByStatusAndCustomerNameContainingIgnoreCaseOrStatusAndCustomerCodeContainingIgnoreCaseOrderByCustomerNameAsc(
            String statusName, String name, String statusCode, String code, Pageable pageable);
}
