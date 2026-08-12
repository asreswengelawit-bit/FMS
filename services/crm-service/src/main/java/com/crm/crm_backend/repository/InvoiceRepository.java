package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {
    long count();
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    boolean existsByInvoiceNumber(String invoiceNumber);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByCustomerId(Long customerId);

    List<Invoice> findBySalesOrderId(Long salesOrderId);

    long countByStatus(InvoiceStatus status);

    @Query("select coalesce(sum(i.totalAmount), 0) from Invoice i where i.status <> com.crm.crm_backend.model.enums.InvoiceStatus.CANCELLED")
    BigDecimal sumTotalAmountExcludingCancelled();

    @Query("select coalesce(sum(i.paidAmount), 0) from Invoice i where i.status <> com.crm.crm_backend.model.enums.InvoiceStatus.CANCELLED")
    BigDecimal sumPaidAmountExcludingCancelled();

    @Query("""
            select coalesce(sum(i.balanceAmount), 0) from Invoice i
            where i.status in (
                com.crm.crm_backend.model.enums.InvoiceStatus.SENT,
                com.crm.crm_backend.model.enums.InvoiceStatus.PENDING,
                com.crm.crm_backend.model.enums.InvoiceStatus.OVERDUE
            )
            """)
    BigDecimal sumOpenBalanceAmount();

    @Query("""
            select i from Invoice i
            where i.dueDate is not null
              and i.dueDate < :today
              and i.status in :statuses
              and (i.balanceAmount is null or i.balanceAmount > 0)
            """)
    List<Invoice> findPastDueForOverdue(
            @Param("today") LocalDate today,
            @Param("statuses") Collection<InvoiceStatus> statuses);
}
