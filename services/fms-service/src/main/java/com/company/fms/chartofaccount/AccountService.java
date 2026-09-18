package com.company.fms.chartofaccount;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.fms.chartofaccount.dto.AccountResponse;
import com.company.fms.chartofaccount.dto.CreateAccountRequest;
import com.company.fms.shared.ConflictException;
import com.company.fms.shared.CurrentUser;
import com.company.fms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository repository;
    private final CurrentUser currentUser;

    public AccountService(AccountRepository repository, CurrentUser currentUser) {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public Page<AccountResponse> findAll(String type, String status, Pageable pageable) {
        Page<Account> page;
        if (type != null && !type.isBlank() && status != null && !status.isBlank()) {
            page = repository.findByTypeAndStatus(type, status, pageable);
        } else if (type != null && !type.isBlank()) {
            page = repository.findByType(type, pageable);
        } else if (status != null && !status.isBlank()) {
            page = repository.findByStatus(status, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        return page.map(AccountResponse::from);
    }

    public AccountResponse findById(String id) {
        return AccountResponse.from(getAccount(id));
    }

    @Transactional
    public AccountResponse create(CreateAccountRequest request) {
        String normalBalance = request.type().equals("ASSET") || request.type().equals("EXPENSE")
                ? "DEBIT" : "CREDIT";
        if (repository.findByCode(request.code().trim()).isPresent()) {
            throw new ConflictException("Account code already exists: " + request.code());
        }
        boolean postingAllowed = request.postingAllowed() == null || request.postingAllowed();
        Account account = new Account(
                UUID.randomUUID().toString(),
                request.code().trim(),
                request.name().trim(),
                request.type(),
                normalBalance,
                request.parentAccountId(),
                postingAllowed,
                request.description(),
                "ACTIVE",
                currentUser.get());
        try {
            return AccountResponse.from(repository.saveAndFlush(account));
        } catch (DataIntegrityViolationException exception) {
            throw new ConflictException("Account code already exists");
        }
    }

    @Transactional
    public AccountResponse toggleStatus(String id) {
        Account account = getAccount(id);
        account.toggleStatus(currentUser.get());
        return AccountResponse.from(repository.save(account));
    }

    public Account getAccount(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + id));
    }

    public Account getDefaultBankAccount() {
        return repository.findByTypeOrderByCodeAsc("BANK").stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No bank account is set up. Create a BANK account before posting payments."));
    }

    public Account getDefaultApOrArAccount(String side) {
        String type = "PAYABLE".equals(side) ? "LIABILITY" : "ASSET";
        List<Account> candidates = repository.findByTypeOrderByCodeAsc(type);
        for (Account account : candidates) {
            String code = account.getCode().toUpperCase();
            if ("PAYABLE".equals(side)
                    && (account.getName().toUpperCase().contains("PAYABLE")
                            || account.getName().toUpperCase().contains("AP"))) {
                return account;
            }
            if ("RECEIVABLE".equals(side)
                    && (account.getName().toUpperCase().contains("RECEIVABLE")
                            || account.getName().toUpperCase().contains("AR"))) {
                return account;
            }
        }
        return candidates.stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No " + type + " account is set up for " + side + " postings."));
    }

    BigDecimal balanceOfRef(String accountId) {
        Account account = getAccount(accountId);
        return account.getBalance() == null ? BigDecimal.ZERO : account.getBalance();
    }
}
