package com.crm.crm_backend.dto.request;

import com.crm.crm_backend.model.enums.OrderType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SalesOrderCreateDTO {

    @NotNull
    private Long customerId;

    @NotNull
    private Long opportunityId;

    @NotNull
    private OrderType type;

    private LocalDate orderDate;

    private LocalDate deliveryDate;

    private String currency;

    private String notes;

    private List<OrderItemRequestDTO> items;
}
