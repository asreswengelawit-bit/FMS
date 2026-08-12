package com.company.mms.warehouse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;
import com.company.mms.warehouse.dto.CreateWarehouseRequest;
import com.company.mms.warehouse.dto.UpdateWarehouseRequest;

@ExtendWith(MockitoExtension.class)
class WarehouseServiceTests {

    @Mock
    private WarehouseRepository repository;

    private WarehouseService service;

    @BeforeEach
    void setUp() {
        service = new WarehouseService(repository);
    }

    @Test
    void createsWarehouseWithFrontendCompatibleResponse() {
        CreateWarehouseRequest request = new CreateWarehouseRequest(
                "WH-Main", "Main Warehouse", "Addis Ababa HQ", "General",
                new BigDecimal("5000"), "Dawit Alemu", null);
        when(repository.existsById("WH-Main")).thenReturn(false);
        when(repository.saveAndFlush(any(Warehouse.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(repository.calculateUsedCapacity("WH-Main")).thenReturn(new BigDecimal("120"));
        when(repository.countInventoryItems("WH-Main")).thenReturn(4L);

        var response = service.create(request);

        assertThat(response.id()).isEqualTo("WH-Main");
        assertThat(response.manager()).isEqualTo("Dawit Alemu");
        assertThat(response.type()).isEqualTo("General");
        assertThat(response.used()).isEqualByComparingTo("120");
        assertThat(response.items()).isEqualTo(4);
        assertThat(response.active()).isTrue();
    }

    @Test
    void rejectsDuplicateWarehouseCode() {
        CreateWarehouseRequest request = new CreateWarehouseRequest(
                "WH-Main", "Main Warehouse", "HQ", "General",
                BigDecimal.TEN, "Manager", true);
        when(repository.existsById("WH-Main")).thenReturn(true);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");
        verify(repository, never()).saveAndFlush(any());
    }

    @Test
    void updatesExistingWarehouse() {
        Warehouse warehouse = new Warehouse("WH-1", "Old", "HQ", "General",
                BigDecimal.TEN, "Old Manager", true);
        when(repository.findById("WH-1")).thenReturn(Optional.of(warehouse));
        when(repository.saveAndFlush(warehouse)).thenReturn(warehouse);
        when(repository.calculateUsedCapacity("WH-1")).thenReturn(BigDecimal.ZERO);

        var response = service.update("WH-1", new UpdateWarehouseRequest(
                "Updated", "Hawassa", "Cold Chain", new BigDecimal("250"), "New Manager", false));

        assertThat(response.name()).isEqualTo("Updated");
        assertThat(response.location()).isEqualTo("Hawassa");
        assertThat(response.active()).isFalse();
    }

    @Test
    void reportsMissingWarehouse() {
        when(repository.findById("WH-404")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById("WH-404"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Warehouse not found: WH-404");
    }
}
