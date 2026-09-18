package com.company.fms.invoice;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {

    Page<Invoice> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Invoice> findAllByOrderByCreatedAtDesc();

    List<Invoice> findByVendorId(String vendorId);

    List<Invoice> findByCustomerId(String customerId);

    List<Invoice> findByInvoiceType(String invoiceType);

    long countByStatusIn(List<String> statuses);
}
