package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.response.SalesOrderResponseDTO;
import com.crm.crm_backend.event.publisher.OrderEventPublisher;
import com.crm.crm_backend.mapper.SalesOrderMapper;
import com.crm.crm_backend.model.entity.OrderItem;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.OrderStatus;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.OpportunityRepository;
import com.crm.crm_backend.repository.SalesOrderRepository;
import com.crm.crm_backend.validator.SalesOrderValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SalesOrderServiceConfirmTest {

    @Mock
    private SalesOrderRepository salesOrderRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private OpportunityRepository opportunityRepository;
    @Mock
    private SalesOrderMapper salesOrderMapper;
    @Mock
    private OrderEventPublisher orderEventPublisher;
    @Mock
    private SalesOrderValidator salesOrderValidator;

    @InjectMocks
    private SalesOrderService salesOrderService;

    private SalesOrder order;

    @BeforeEach
    void setUp() {
        order = SalesOrder.builder()
                .id(5L)
                .orderNumber("SO-5")
                .status(OrderStatus.DRAFT)
                .subtotal(new BigDecimal("100"))
                .totalAmount(new BigDecimal("100"))
                .orderItems(new ArrayList<>())
                .build();
        order.getOrderItems().add(OrderItem.builder()
                .sku("SKU-1")
                .itemName("Widget")
                .quantity(2)
                .unitPrice(new BigDecimal("50"))
                .totalPrice(new BigDecimal("100"))
                .salesOrder(order)
                .build());
    }

    @Test
    void confirmDraftOrderPublishesEventAndSetsApproved() {
        when(salesOrderRepository.findById(5L)).thenReturn(Optional.of(order));
        doNothing().when(salesOrderValidator).validateCanConfirm(order);
        when(salesOrderRepository.save(any(SalesOrder.class))).thenAnswer(inv -> inv.getArgument(0));

        SalesOrderResponseDTO dto = new SalesOrderResponseDTO();
        dto.setId(5L);
        dto.setStatus(OrderStatus.APPROVED);
        when(salesOrderMapper.toResponseDTO(any(SalesOrder.class))).thenReturn(dto);

        SalesOrderResponseDTO result = salesOrderService.confirmSalesOrder(5L);

        assertEquals(OrderStatus.APPROVED, result.getStatus());
        assertEquals(OrderStatus.APPROVED, order.getStatus());
        verify(orderEventPublisher).publishSalesOrderConfirmed(order);
    }

    @Test
    void confirmAlreadyApprovedIsRejected() {
        order.setStatus(OrderStatus.APPROVED);
        when(salesOrderRepository.findById(5L)).thenReturn(Optional.of(order));

        assertThrows(IllegalStateException.class, () -> salesOrderService.confirmSalesOrder(5L));
        verify(orderEventPublisher, never()).publishSalesOrderConfirmed(any());
        verify(salesOrderRepository, never()).save(any());
    }
}
