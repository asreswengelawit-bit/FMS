package com.company.mms.warehouse;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class WarehouseRepositoryTests {

    private final WarehouseRepository repository;

    @Autowired
    WarehouseRepositoryTests(WarehouseRepository repository) {
        this.repository = repository;
    }

    @Test
    void persistsWarehouseAndCalculatesEmptyUtilization() {
        Warehouse warehouse = new Warehouse(
                "WH-TEST", "Test Warehouse", "Test Location", "General",
                new BigDecimal("1000"), "Test Manager", true);

        repository.saveAndFlush(warehouse);

        Warehouse saved = repository.findById("WH-TEST").orElseThrow();
        assertThat(saved.getName()).isEqualTo("Test Warehouse");
        assertThat(repository.calculateUsedCapacity("WH-TEST")).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(repository.countInventoryItems("WH-TEST")).isZero();
    }
}
