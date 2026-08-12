package com.crm.crm_backend.dto.response;


import com.crm.crm_backend.model.enums.OrderStatus;
import com.crm.crm_backend.model.enums.OrderType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SalesOrderResponseDTO {

    private Long id;

    private String orderNumber;

    private Long customerId;

    private Long opportunityId;

    private Long quotationId;

    private OrderStatus status;

    private OrderType type;

    private LocalDate orderDate;

    private LocalDate deliveryDate;

    private BigDecimal subtotal;

    private BigDecimal taxAmount;

    private BigDecimal discountAmount;

    private BigDecimal totalAmount;

    private String currency;

    private String notes;

    private List<OrderItemResponseDTO> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
