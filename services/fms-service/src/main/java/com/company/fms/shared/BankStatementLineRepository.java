package com.company.fms.shared;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankStatementLineRepository extends JpaRepository<BankStatementLine, String> {

    List<BankStatementLine> findByBankAccountIdOrderByTransactionDateDesc(String bankAccountId);

    Page<BankStatementLine> findByBankAccountIdOrderByTransactionDateDesc(String bankAccountId, Pageable pageable);

    Page<BankStatementLine> findByBankAccountIdAndReconciliationStatusOrderByTransactionDateDesc(
            String bankAccountId, String reconciliationStatus, Pageable pageable);

    long countByBankAccountIdAndReconciliationStatus(String bankAccountId, String reconciliationStatus);
}
