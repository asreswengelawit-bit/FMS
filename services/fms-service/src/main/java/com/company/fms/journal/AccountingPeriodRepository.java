package com.company.fms.journal;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountingPeriodRepository extends JpaRepository<AccountingPeriod, String> {

    Optional<AccountingPeriod> findByPeriodName(String periodName);

    List<AccountingPeriod> findAllByOrderByStartDateDesc();

    Optional<AccountingPeriod> findFirstByStatusOrderByStartDateDesc(String status);
}
