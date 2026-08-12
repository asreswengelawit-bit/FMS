package com.company.mms.inventory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import com.company.mms.inventory.dto.AdjustInventoryRequest;
import com.company.mms.inventory.dto.InventoryQuantityRequest;
import com.company.mms.shared.ConflictException;
import com.company.mms.warehouse.Warehouse;
import com.company.mms.warehouse.WarehouseRepository;

@SpringBootTest
@Transactional
class InventoryServiceTests {

    private final InventoryService service;
    private final WarehouseRepository warehouseRepository;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    InventoryServiceTests(InventoryService service, WarehouseRepository warehouseRepository,
            JdbcTemplate jdbcTemplate) {
        this.service = service;
        this.warehouseRepository = warehouseRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @BeforeEach
    void setUp() {
        Warehouse warehouse = new Warehouse(
                "WH-INVENTORY", "Inventory Test Warehouse", "Addis Ababa", "General",
                new BigDecimal("100"), "Test Manager", true);
        warehouseRepository.saveAndFlush(warehouse);
        jdbcTemplate.update("""
                INSERT INTO materials (
                    id, name, category, unit_of_measure, unit_cost, reorder_level, active
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                "MAT-001", "Test Material", "Test", "Pcs",
                new BigDecimal("25"), new BigDecimal("20"), true);
    }

    @Test
    void addsStockAndCreatesAuditMovement() {
        var result = service.adjust(adjustment(new BigDecimal("60"), "ADJ-001"), "store-keeper");

        assertThat(result.inventory().onHand()).isEqualByComparingTo("60");
        assertThat(result.inventory().reserved()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.inventory().available()).isEqualByComparingTo("60");
        assertThat(result.inventory().inventoryValue()).isEqualByComparingTo("1500");
        assertThat(result.inventory().status()).isEqualTo("Normal");
        assertThat(result.movement().type()).isEqualTo("ADJ");
        assertThat(result.movement().processedBy()).isEqualTo("store-keeper");
    }

    @Test
    void reservesAndReleasesAvailableStock() {
        service.adjust(adjustment(new BigDecimal("80"), "ADJ-002"), "manager");

        var reserved = service.reserve(quantityRequest(new BigDecimal("30"), "REQ-001"), "manager");
        var released = service.release(quantityRequest(new BigDecimal("10"), "REQ-001-CANCEL"), "manager");

        assertThat(reserved.inventory().reserved()).isEqualByComparingTo("30");
        assertThat(released.inventory().reserved()).isEqualByComparingTo("20");
        assertThat(released.inventory().available()).isEqualByComparingTo("60");
        assertThat(released.movement().type()).isEqualTo("RELEASE");
        assertThat(released.movement().quantity()).isEqualByComparingTo("-10");
        assertThat(service.findMovements("WH-INVENTORY", "MAT-001", null)).hasSize(3);
    }

    @Test
    void preventsAdjustmentBelowReservedQuantity() {
        service.adjust(adjustment(new BigDecimal("10"), "ADJ-003"), "manager");
        service.reserve(quantityRequest(new BigDecimal("8"), "REQ-002"), "manager");

        assertThatThrownBy(() -> service.adjust(
                adjustment(new BigDecimal("-5"), "ADJ-004"), "manager"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("reserved quantity");
    }

    @Test
    void preventsWarehouseCapacityOverflow() {
        assertThatThrownBy(() -> service.adjust(
                adjustment(new BigDecimal("101"), "ADJ-005"), "manager"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("exceeds warehouse capacity");
    }

    @Test
    void identifiesLowStockFromAvailableQuantity() {
        service.adjust(adjustment(new BigDecimal("15"), "ADJ-006"), "manager");

        var lowStock = service.findAll(null, null, true);

        assertThat(lowStock).hasSize(1);
        assertThat(lowStock.getFirst().status()).isEqualTo("Low Stock");
    }

    private AdjustInventoryRequest adjustment(BigDecimal quantity, String reference) {
        return new AdjustInventoryRequest(
                "MAT-001", "WH-INVENTORY", quantity, reference,
                "Inventory integration test", LocalDate.of(2026, 7, 30));
    }

    private InventoryQuantityRequest quantityRequest(BigDecimal quantity, String reference) {
        return new InventoryQuantityRequest(
                "MAT-001", "WH-INVENTORY", quantity, reference,
                "Inventory integration test", LocalDate.of(2026, 7, 30));
    }
}
