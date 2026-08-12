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
import com.crm.crm_backend.model.enums.PaymentMethod;
import com.crm.crm_backend.model.enums.PaymentStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.InvoiceRepository;
import com.crm.crm_backend.repository.PaymentRepository;
import com.crm.crm_backend.validator.PaymentValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceMoneyPathTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private PaymentMapper paymentMapper;
    @Mock
    private PaymentEventPublisher paymentEventPublisher;
    @Mock
    private PaymentValidator paymentValidator;

    @InjectMocks
    private PaymentService paymentService;

    private Invoice invoice;
    private Customer customer;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setId(10L);

        invoice = new Invoice();
        invoice.setId(50L);
        invoice.setStatus(InvoiceStatus.PENDING);
        invoice.setTotalAmount(new BigDecimal("100"));
        invoice.setPaidAmount(BigDecimal.ZERO);
        invoice.setBalanceAmount(new BigDecimal("100"));
    }

    @Test
    void createFullPaymentMarksInvoicePaid() {
        PaymentCreateDTO dto = new PaymentCreateDTO();
        dto.setInvoiceId(50L);
        dto.setCustomerId(10L);
        dto.setAmount(new BigDecimal("100"));
        dto.setPaymentMethod(PaymentMethod.BANK_TRANSFER);

        when(invoiceRepository.findById(50L)).thenReturn(Optional.of(invoice));
        when(customerRepository.findById(10L)).thenReturn(Optional.of(customer));
        doNothing().when(paymentValidator).validatePaymentAmount(invoice, dto.getAmount());

        Payment payment = Payment.builder()
                .amount(new BigDecimal("100"))
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .build();
        when(paymentMapper.toEntity(dto)).thenReturn(payment);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> {
            Payment p = inv.getArgument(0);
            p.setId(70L);
            return p;
        });
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setId(70L);
        response.setStatus(PaymentStatus.COMPLETED);
        when(paymentMapper.toResponseDTO(any(Payment.class))).thenReturn(response);

        PaymentResponseDTO result = paymentService.createPayment(dto);

        assertEquals(PaymentStatus.COMPLETED, result.getStatus());
        assertEquals(InvoiceStatus.PAID, invoice.getStatus());
        assertEquals(0, BigDecimal.ZERO.compareTo(invoice.getBalanceAmount()));
        assertEquals(0, new BigDecimal("100").compareTo(invoice.getPaidAmount()));
        verify(paymentEventPublisher).publishPaymentReceived(any(Payment.class));
    }

    @Test
    void cancelCompletedPaymentReversesInvoiceBalance() {
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAmount(new BigDecimal("100"));
        invoice.setBalanceAmount(BigDecimal.ZERO);

        Payment payment = Payment.builder()
                .id(70L)
                .amount(new BigDecimal("100"))
                .status(PaymentStatus.COMPLETED)
                .invoice(invoice)
                .customer(customer)
                .build();

        when(paymentRepository.findById(70L)).thenReturn(Optional.of(payment));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setId(70L);
        response.setStatus(PaymentStatus.CANCELLED);
        when(paymentMapper.toResponseDTO(any(Payment.class))).thenReturn(response);

        PaymentUpdateDTO update = new PaymentUpdateDTO();
        update.setStatus(PaymentStatus.CANCELLED);

        PaymentResponseDTO result = paymentService.updatePayment(70L, update);

        assertEquals(PaymentStatus.CANCELLED, result.getStatus());
        assertEquals(PaymentStatus.CANCELLED, payment.getStatus());
        assertEquals(InvoiceStatus.PENDING, invoice.getStatus());
        assertEquals(0, BigDecimal.ZERO.compareTo(invoice.getPaidAmount()));
        assertEquals(0, new BigDecimal("100").compareTo(invoice.getBalanceAmount()));
    }

    @Test
    void deleteCompletedPaymentIsForbidden() {
        Payment payment = Payment.builder()
                .id(70L)
                .status(PaymentStatus.COMPLETED)
                .amount(new BigDecimal("50"))
                .invoice(invoice)
                .build();
        when(paymentRepository.findById(70L)).thenReturn(Optional.of(payment));

        assertThrows(IllegalStateException.class, () -> paymentService.deletePayment(70L));
        verify(paymentRepository, never()).delete(any());
    }
}
