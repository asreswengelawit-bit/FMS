package com.company.fms.payable.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ApAgingReport(
        LocalDate asOfDate,
        List<Item> items,
        BigDecimal totalCurrent,
        BigDecimal totalDays30,
        BigDecimal totalDays60,
        BigDecimal totalDays90,
        BigDecimal totalDays120,
        BigDecimal grandTotal) {

    public record Item(
            String vendorId,
            String vendorCode,
            String vendorName,
            BigDecimal current,
            BigDecimal days30,
            BigDecimal days60,
            BigDecimal days90,
            BigDecimal days120,
            BigDecimal totalOutstanding) {
    }
}
