package com.company.fms.payment;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, String> {

    Page<Payment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Payment> findAllByOrderByCreatedAtDesc();

    List<Payment> findByPaymentType(String paymentType);

    List<Payment> findByInvoiceId(String invoiceId);

    Long countByStatus(String status);
}
