package com.crm.crm_backend.validator;

import com.crm.crm_backend.dto.request.OrderItemRequestDTO;
import com.crm.crm_backend.dto.request.SalesOrderCreateDTO;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.OrderStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class SalesOrderValidator {

    public void validateCreate(SalesOrderCreateDTO dto) {
        if (dto.getCustomerId() == null) {
            throw new IllegalStateException("Customer ID is required");
        }
        if (dto.getOpportunityId() == null) {
            throw new IllegalStateException("Opportunity ID is required");
        }
        validateDates(dto.getOrderDate(), dto.getDeliveryDate());
        validateItems(dto.getItems());
    }

    public void validateCanConfirm(SalesOrder order) {
        if (order == null) {
            throw new IllegalStateException("Sales order is required");
        }
        if (order.getStatus() != OrderStatus.DRAFT && order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException(
                    "Only DRAFT or PENDING orders can be confirmed. Current status: " + order.getStatus());
        }
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new IllegalStateException("Cannot confirm a sales order with no line items");
        }
        if (order.getTotalAmount() != null && order.getTotalAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Sales order total cannot be negative");
        }
    }

    public void validateDates(LocalDate orderDate, LocalDate deliveryDate) {
        if (orderDate != null && deliveryDate != null && deliveryDate.isBefore(orderDate)) {
            throw new IllegalStateException("Delivery date cannot be before order date");
        }
    }

    public void validateItems(List<OrderItemRequestDTO> items) {
        if (items == null) {
            return;
        }
        for (OrderItemRequestDTO item : items) {
            if (item.getQuantity() != null && item.getQuantity() <= 0) {
                throw new IllegalStateException("Order item quantity must be greater than zero");
            }
            if (item.getUnitPrice() != null && item.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalStateException("Order item unit price cannot be negative");
            }
        }
    }
}
