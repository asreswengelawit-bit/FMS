package com.crm.crm_backend.service.analytics;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class KpiCalculatorService {

    public double rate(long numerator, long denominator) {
        if (denominator <= 0) {
            return 0.0;
        }
        return (numerator * 100.0) / denominator;
    }

    public BigDecimal coalesce(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    public BigDecimal weightedAmount(BigDecimal amount, Integer probabilityPercent) {
        if (amount == null) {
            return BigDecimal.ZERO;
        }
        int probability = probabilityPercent != null ? Math.max(0, Math.min(100, probabilityPercent)) : 0;
        return amount.multiply(BigDecimal.valueOf(probability))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}
