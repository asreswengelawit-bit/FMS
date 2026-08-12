package com.crm.crm_backend.service.core;

import com.crm.crm_backend.event.publisher.InvoiceEventPublisher;
import com.crm.crm_backend.mapper.InvoiceMapper;
import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.InvoiceRepository;
import com.crm.crm_backend.repository.SalesOrderRepository;
import com.crm.crm_backend.validator.InvoiceValidator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceReminderTest {

    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private SalesOrderRepository salesOrderRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private InvoiceMapper invoiceMapper;
    @Mock
    private InvoiceEventPublisher invoiceEventPublisher;
    @Mock
    private InvoiceValidator invoiceValidator;

    @InjectMocks
    private InvoiceService invoiceService;

    @Test
    void processOverdueAndReminders_marksSentAsOverdueAndPublishes() {
        Invoice invoice = Invoice.builder()
                .id(9L)
                .invoiceNumber("INV-9")
                .status(InvoiceStatus.SENT)
                .dueDate(LocalDate.now().minusDays(2))
                .balanceAmount(new BigDecimal("50.00"))
                .build();

        when(invoiceRepository.findPastDueForOverdue(
                any(LocalDate.class),
                eq(EnumSet.of(InvoiceStatus.SENT, InvoiceStatus.PENDING, InvoiceStatus.OVERDUE))))
                .thenReturn(List.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));

        int reminded = invoiceService.processOverdueAndReminders();

        assertThat(reminded).isEqualTo(1);
        assertThat(invoice.getStatus()).isEqualTo(InvoiceStatus.OVERDUE);
        assertThat(invoice.getLastReminderSentAt()).isNotNull();
        verify(invoiceEventPublisher).publishInvoiceOverdueReminder(invoice);

        ArgumentCaptor<Invoice> saved = ArgumentCaptor.forClass(Invoice.class);
        verify(invoiceRepository, org.mockito.Mockito.atLeastOnce()).save(saved.capture());
        assertThat(saved.getAllValues()).isNotEmpty();
    }
}
