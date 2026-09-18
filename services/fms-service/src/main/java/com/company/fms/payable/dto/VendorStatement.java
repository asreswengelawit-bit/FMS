package com.company.fms.payable.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record VendorStatement(
        String vendorId,
        String vendorCode,
        String vendorName,
        LocalDate fromDate,
        LocalDate toDate,
        BigDecimal openingBalance,
        BigDecimal closingBalance,
        List<Line> lines) {

    public record Line(
            String journalId,
            String date,
            String description,
            BigDecimal debit,
            BigDecimal credit,
            BigDecimal balance) {
    }
}
