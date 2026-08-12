package com.crm.crm_backend.service.analytics;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class KpiCalculatorServiceTest {

    private final KpiCalculatorService calculator = new KpiCalculatorService();

    @Test
    void rate_handlesZeroDenominator() {
        assertThat(calculator.rate(5, 0)).isEqualTo(0.0);
        assertThat(calculator.rate(1, 4)).isEqualTo(25.0);
    }

    @Test
    void weightedAmount_appliesProbability() {
        assertThat(calculator.weightedAmount(new BigDecimal("200.00"), 50))
                .isEqualByComparingTo("100.00");
        assertThat(calculator.weightedAmount(null, 80))
                .isEqualByComparingTo("0");
    }
}
