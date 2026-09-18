package com.company.fms.journal;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, String> {

    List<JournalEntry> findAllByOrderByCreatedAtDesc();

    Page<JournalEntry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<JournalEntry> findByStatusNot(String status);

    List<JournalEntry> findByStatus(String status);

    List<JournalEntry> findByStatusIn(List<String> statuses);

    List<JournalEntry> findByPeriodId(String periodId);

    long countByPeriodIdAndStatusIn(String periodId, List<String> statuses);

    long countByStatusIn(List<String> statuses);

    long countByStatus(String status);

    long countByStatusNot(String status);
}
