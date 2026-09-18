package com.company.fms.receivable.dto;

import java.math.BigDecimal;

public record ArAging(
        String customerId,
        String customerCode,
        String customerName,
        BigDecimal current,
        BigDecimal days1to30,
        BigDecimal days31to60,
        BigDecimal days61to90,
        BigDecimal over90,
        BigDecimal total) {
}
