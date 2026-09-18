package com.company.fms.budget;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, String> {

    List<Budget> findAllByOrderByCreatedAtDesc();

    Page<Budget> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Budget> findByBudgetPeriodOrderByCreatedAtDesc(String budgetPeriod, Pageable pageable);

    Page<Budget> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Page<Budget> findByBudgetPeriodAndStatusOrderByCreatedAtDesc(String budgetPeriod, String status, Pageable pageable);

    long countByStatus(String status);
}
