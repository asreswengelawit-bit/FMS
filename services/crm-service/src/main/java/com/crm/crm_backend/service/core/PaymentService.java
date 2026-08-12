package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.PaymentCreateDTO;
import com.crm.crm_backend.dto.request.PaymentUpdateDTO;
import com.crm.crm_backend.dto.response.PaymentResponseDTO;
import com.crm.crm_backend.event.publisher.PaymentEventPublisher;
import com.crm.crm_backend.mapper.PaymentMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.entity.Payment;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.model.enums.PaymentStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.InvoiceRepository;
import com.crm.crm_backend.repository.PaymentRepository;
import com.crm.crm_backend.service.workflow.DomainStatusGuard;
import com.crm.crm_backend.validator.PaymentValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final PaymentMapper paymentMapper;
    private final PaymentEventPublisher paymentEventPublisher;
    private final PaymentValidator paymentValidator;

    public PaymentResponseDTO createPayment(PaymentCreateDTO dto) {

        Invoice invoice = invoiceRepository.findById(dto.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        paymentValidator.validatePaymentAmount(invoice, dto.getAmount());

        Payment payment = paymentMapper.toEntity(dto);

        payment.setInvoice(invoice);
        payment.setCustomer(customer);
        payment.setPaymentNumber("PAY-" + System.currentTimeMillis());
        payment.setStatus(PaymentStatus.COMPLETED);

        Payment saved = paymentRepository.save(payment);
        applyPaymentToInvoice(invoice, payment.getAmount());
        invoiceRepository.save(invoice);
        paymentEventPublisher.publishPaymentReceived(saved);

        return paymentMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDTO getPayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return paymentMapper.toResponseDTO(payment);
    }

    @Transactional(readOnly = true)
    public Page<PaymentResponseDTO> getAllPayments(Pageable pageable) {

        return paymentRepository.findAll(pageable)
                .map(paymentMapper::toResponseDTO);
    }

    public PaymentResponseDTO updatePayment(Long id, PaymentUpdateDTO dto) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.CANCELLED
                || payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new IllegalStateException(
                    "Cannot update a " + payment.getStatus() + " payment");
        }

        PaymentStatus previousStatus = payment.getStatus();
        PaymentStatus targetStatus = dto.getStatus();

        if (targetStatus != null
                && (targetStatus == PaymentStatus.CANCELLED || targetStatus == PaymentStatus.REFUNDED)
                && previousStatus == PaymentStatus.COMPLETED) {
            reversePaymentFromInvoice(payment);
            payment.setStatus(targetStatus);
            dto.setStatus(null);
        } else if (targetStatus != null
                && targetStatus != previousStatus
                && targetStatus != PaymentStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Unsupported payment status change from "
                            + previousStatus + " to " + targetStatus
                            + ". Use CANCELLED or REFUNDED to reverse.");
        }

        paymentMapper.updateEntityFromDTO(dto, payment);
        Payment updated = paymentRepository.save(payment);
        return paymentMapper.toResponseDTO(updated);
    }

    /**
     * Hard delete is forbidden for completed payments — reverse via CANCELLED/REFUNDED update.
     * Non-completed payments may be deleted without invoice impact.
     */
    public void deletePayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Cannot delete a COMPLETED payment. Update status to CANCELLED or REFUNDED to reverse invoice balances.");
        }

        paymentRepository.delete(payment);
        log.info("Payment {} deleted", id);
    }

    private void applyPaymentToInvoice(Invoice invoice, BigDecimal amount) {
        BigDecimal paidAmount = (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO)
                .add(amount);
        invoice.setPaidAmount(paidAmount);

        BigDecimal balance = invoice.getTotalAmount().subtract(paidAmount);
        invoice.setBalanceAmount(balance);

        if (balance.compareTo(BigDecimal.ZERO) <= 0) {
            DomainStatusGuard.assertInvoiceTransition(invoice.getStatus(), InvoiceStatus.PAID);
            invoice.setStatus(InvoiceStatus.PAID);
        } else if (invoice.getStatus() == InvoiceStatus.DRAFT
                || invoice.getStatus() == InvoiceStatus.SENT) {
            DomainStatusGuard.assertInvoiceTransition(invoice.getStatus(), InvoiceStatus.PENDING);
            invoice.setStatus(InvoiceStatus.PENDING);
        }
    }

    private void reversePaymentFromInvoice(Payment payment) {
        Invoice invoice = payment.getInvoice();
        if (invoice == null) {
            return;
        }

        BigDecimal amount = payment.getAmount() != null ? payment.getAmount() : BigDecimal.ZERO;
        BigDecimal paidAmount = (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO)
                .subtract(amount);
        if (paidAmount.compareTo(BigDecimal.ZERO) < 0) {
            paidAmount = BigDecimal.ZERO;
        }

        invoice.setPaidAmount(paidAmount);
        BigDecimal total = invoice.getTotalAmount() != null ? invoice.getTotalAmount() : BigDecimal.ZERO;
        invoice.setBalanceAmount(total.subtract(paidAmount));

        if (invoice.getStatus() == InvoiceStatus.PAID && paidAmount.compareTo(total) < 0) {
            DomainStatusGuard.assertInvoiceTransition(invoice.getStatus(), InvoiceStatus.PENDING);
            invoice.setStatus(InvoiceStatus.PENDING);
        }

        invoiceRepository.save(invoice);
        log.info("Reversed payment {} amount {} from invoice {}",
                payment.getId(), amount, invoice.getId());
    }
}
