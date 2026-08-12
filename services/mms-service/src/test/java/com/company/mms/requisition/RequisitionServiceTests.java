package com.company.mms.requisition;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.company.mms.inventory.Inventory;
import com.company.mms.inventory.InventoryRepository;
import com.company.mms.inventory.MaterialReference;
import com.company.mms.inventory.MaterialReferenceRepository;
import com.company.mms.requisition.dto.CreateRequisitionRequest;
import com.company.mms.shared.ConflictException;
import com.company.mms.stockmovement.StockMovementRepository;

@ExtendWith(MockitoExtension.class)
class RequisitionServiceTests {

    @Mock
    private RequisitionRepository repository;

    @Mock
    private MaterialReferenceRepository materialRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private StockMovementRepository movementRepository;

    private RequisitionService service;

    @BeforeEach
    void setUp() {
        service = new RequisitionService(repository, materialRepository, inventoryRepository, movementRepository);
    }

    @Test
    void createsRequisitionSuccessfully() {
        MaterialReference mat = new MaterialReference("ITM-001", "Paper Reams A4", "Pcs", new BigDecimal("10"), new BigDecimal("100"), true);
        when(materialRepository.findById("ITM-001")).thenReturn(Optional.of(mat));
        when(repository.save(any(Requisition.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateRequisitionRequest request = new CreateRequisitionRequest(
                "Solomon T.", "HR", "ITM-001", "Paper Reams A4", new BigDecimal("5"), new BigDecimal("5"),
                null, null, "Normal");

        var response = service.create(request);

        assertThat(response.requestedBy()).isEqualTo("Solomon T.");
        assertThat(response.department()).isEqualTo("HR");
        assertThat(response.quantity()).isEqualByComparingTo("5");
        assertThat(response.status()).isEqualTo("Pending");
    }

    @Test
    void issuesRequisitionAndUpdatesInventory() {
        Requisition req = new Requisition("REQ-101", "Bethlehem K.", "IT", "ITM-001", new BigDecimal("10"), null, "High", "Pending");
        MaterialReference mat = new MaterialReference("ITM-001", "Paper Reams A4", "Pcs", new BigDecimal("10"), new BigDecimal("100"), true);
        Inventory inv = new Inventory("ITM-001", "WH-001");
        inv.adjustOnHand(new BigDecimal("50"));

        when(repository.findById("REQ-101")).thenReturn(Optional.of(req));
        when(materialRepository.findById("ITM-001")).thenReturn(Optional.of(mat));
        when(inventoryRepository.findByMaterialIdOrderByWarehouseIdAsc("ITM-001")).thenReturn(List.of(inv));
        when(repository.save(req)).thenReturn(req);

        var response = service.issue("REQ-101", "StoreKeeper1");

        assertThat(response.status()).isEqualTo("Issued");
        assertThat(inv.getOnHand()).isEqualByComparingTo("40");
        verify(movementRepository).saveAndFlush(any());
    }

    @Test
    void rejectsIssueIfInsufficientStock() {
        Requisition req = new Requisition("REQ-102", "Dawit A.", "Operations", "ITM-001", new BigDecimal("100"), null, "Urgent", "Pending");
        MaterialReference mat = new MaterialReference("ITM-001", "Paper Reams A4", "Pcs", new BigDecimal("10"), new BigDecimal("100"), true);
        Inventory inv = new Inventory("ITM-001", "WH-001");
        inv.adjustOnHand(new BigDecimal("10"));

        when(repository.findById("REQ-102")).thenReturn(Optional.of(req));
        when(materialRepository.findById("ITM-001")).thenReturn(Optional.of(mat));
        when(inventoryRepository.findByMaterialIdOrderByWarehouseIdAsc("ITM-001")).thenReturn(List.of(inv));

        assertThatThrownBy(() -> service.issue("REQ-102", "StoreKeeper1"))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Insufficient available stock");
    }
}
