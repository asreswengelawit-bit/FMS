package com.company.fms.chartofaccount;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {

    Optional<Account> findByCode(String code);

    List<Account> findByTypeOrderByCodeAsc(String type);

    List<Account> findByStatusOrderByCodeAsc(String status);

    List<Account> findByTypeAndStatusOrderByCodeAsc(String type, String status);

    List<Account> findAllByOrderByCodeAsc();

    Page<Account> findByType(String type, Pageable pageable);

    Page<Account> findByStatus(String status, Pageable pageable);

    Page<Account> findByTypeAndStatus(String type, String status, Pageable pageable);
}
