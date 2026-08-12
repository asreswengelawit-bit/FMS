package com.company.mms.item;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.company.mms.inventory.InventoryRepository;
import com.company.mms.item.dto.CreateMaterialRequest;
import com.company.mms.item.dto.UpdateMaterialRequest;
import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class MaterialServiceTests {

    @Mock
    private MaterialRepository repository;

    @Mock
    private InventoryRepository inventoryRepository;

    private MaterialService service;

    @BeforeEach
    void setUp() {
        service = new MaterialService(repository, inventoryRepository);
    }

    @Test
    void createsMaterialSuccessfully() {
        CreateMaterialRequest request = new CreateMaterialRequest(
                "ITM-001", "Paper Reams A4", "Office Supplies", "Box",
                new BigDecimal("450.00"), new BigDecimal("20"), "WH-001");

        when(repository.existsById("ITM-001")).thenReturn(false);
        when(repository.save(any(Material.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = service.create(request);

        assertThat(response.id()).isEqualTo("ITM-001");
        assertThat(response.name()).isEqualTo("Paper Reams A4");
        assertThat(response.category()).isEqualTo("Office Supplies");
        assertThat(response.unitCost()).isEqualByComparingTo("450.00");
        assertThat(response.active()).isTrue();
    }

    @Test
    void rejectsDuplicateMaterialId() {
        CreateMaterialRequest request = new CreateMaterialRequest(
                "ITM-001", "Paper Reams A4", "Office Supplies", "Box",
                new BigDecimal("450.00"), new BigDecimal("20"), "WH-001");

        when(repository.existsById("ITM-001")).thenReturn(true);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");

        verify(repository, never()).save(any());
    }

    @Test
    void updatesMaterialSuccessfully() {
        Material material = new Material("ITM-001", "Old Paper", "Office", "Box",
                new BigDecimal("400.00"), new BigDecimal("10"), true);
        when(repository.findById("ITM-001")).thenReturn(Optional.of(material));
        when(repository.save(material)).thenReturn(material);
        when(inventoryRepository.findByMaterialIdOrderByWarehouseIdAsc("ITM-001")).thenReturn(Collections.emptyList());

        UpdateMaterialRequest updateReq = new UpdateMaterialRequest(
                "Updated Paper", "Supplies", "Box", new BigDecimal("500.00"), new BigDecimal("25"), true, "WH-001");

        var response = service.update("ITM-001", updateReq);

        assertThat(response.name()).isEqualTo("Updated Paper");
        assertThat(response.unitCost()).isEqualByComparingTo("500.00");
    }

    @Test
    void throwsNotFoundForMissingMaterial() {
        when(repository.findById("ITM-999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById("ITM-999"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Material not found: ITM-999");
    }
}
