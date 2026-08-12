package com.crm.crm_backend.dto.request;


import com.crm.crm_backend.model.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SalesOrderUpdateDTO {

    private OrderStatus status;

    private LocalDate deliveryDate;

    private String notes;
}
