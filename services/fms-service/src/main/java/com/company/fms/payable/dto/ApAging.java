package com.company.fms.payable.dto;

import java.math.BigDecimal;

public record ApAging(
        String vendorId,
        String vendorCode,
        String vendorName,
        BigDecimal current,
        BigDecimal days1to30,
        BigDecimal days31to60,
        BigDecimal days61to90,
        BigDecimal over90,
        BigDecimal total) {
}
