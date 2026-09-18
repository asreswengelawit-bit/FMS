package com.company.fms.shared;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BankAccountRepository extends JpaRepository<BankAccount, String> {

    List<BankAccount> findAllByOrderByAccountNameAsc();

    List<BankAccount> findByActiveTrue();
}
