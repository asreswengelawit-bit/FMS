package com.company.fms.receivable.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ArAgingReport(
        LocalDate asOfDate,
        List<Item> items,
        BigDecimal totalCurrent,
        BigDecimal totalDays30,
        BigDecimal totalDays60,
        BigDecimal totalDays90,
        BigDecimal totalDays120,
        BigDecimal grandTotal) {

    public record Item(
            String customerId,
            String customerCode,
            String customerName,
            BigDecimal current,
            BigDecimal days30,
            BigDecimal days60,
            BigDecimal days90,
            BigDecimal days120,
            BigDecimal totalOutstanding) {
    }
}
