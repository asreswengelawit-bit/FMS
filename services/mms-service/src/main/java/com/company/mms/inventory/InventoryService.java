package com.company.mms.inventory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.mms.inventory.dto.AdjustInventoryRequest;
import com.company.mms.inventory.dto.InventoryOperationResponse;
import com.company.mms.inventory.dto.InventoryQuantityRequest;
import com.company.mms.inventory.dto.InventoryResponse;
import com.company.mms.shared.BadRequestException;
import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;
import com.company.mms.stockmovement.StockMovement;
import com.company.mms.stockmovement.StockMovementRepository;
import com.company.mms.stockmovement.dto.StockMovementResponse;
import com.company.mms.warehouse.Warehouse;
import com.company.mms.warehouse.WarehouseRepository;

@Service
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final MaterialReferenceRepository materialRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockMovementRepository movementRepository;

    public InventoryService(InventoryRepository inventoryRepository,
            MaterialReferenceRepository materialRepository,
            WarehouseRepository warehouseRepository,
            StockMovementRepository movementRepository) {
        this.inventoryRepository = inventoryRepository;
        this.materialRepository = materialRepository;
        this.warehouseRepository = warehouseRepository;
        this.movementRepository = movementRepository;
    }

    public List<InventoryResponse> findAll(String warehouseId, String materialReference,
            boolean lowStockOnly) {
        String normalizedWarehouse = normalizeOptional(warehouseId);
        String materialId = materialReference == null || materialReference.isBlank()
                ? null
                : resolveMaterial(materialReference).getId();

        List<Inventory> balances;
        if (normalizedWarehouse != null && materialId != null) {
            balances = inventoryRepository.findByMaterialIdAndWarehouseId(materialId, normalizedWarehouse)
                    .stream().toList();
        } else if (normalizedWarehouse != null) {
            balances = inventoryRepository.findByWarehouseIdOrderByMaterialIdAsc(normalizedWarehouse);
        } else if (materialId != null) {
            balances = inventoryRepository.findByMaterialIdOrderByWarehouseIdAsc(materialId);
        } else {
            balances = inventoryRepository.findAllByOrderByWarehouseIdAscMaterialIdAsc();
        }

        return balances.stream()
                .map(this::toInventoryResponse)
                .filter(response -> !lowStockOnly || !"Normal".equals(response.status()))
                .toList();
    }

    public InventoryResponse findOne(String warehouseId, String materialReference) {
        MaterialReference material = resolveMaterial(materialReference);
        Inventory inventory = inventoryRepository
                .findByMaterialIdAndWarehouseId(material.getId(), warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory balance not found for material " + material.getId()
                                + " in warehouse " + warehouseId));
        return toInventoryResponse(inventory, material, getWarehouse(warehouseId));
    }

    public List<StockMovementResponse> findMovements(String warehouseId, String materialReference,
            String type) {
        String materialId = materialReference == null || materialReference.isBlank()
                ? null
                : resolveMaterial(materialReference).getId();
        String movementType = normalizeOptional(type);
        if (movementType != null) {
            movementType = movementType.toUpperCase();
        }
        return movementRepository.search(normalizeOptional(warehouseId), materialId, movementType)
                .stream()
                .map(this::toMovementResponse)
                .toList();
    }

    @Transactional
    public InventoryOperationResponse adjust(AdjustInventoryRequest request, String actor) {
        if (request.quantity().compareTo(BigDecimal.ZERO) == 0) {
            throw new BadRequestException("Adjustment quantity must not be zero");
        }

        MaterialReference material = getActiveMaterial(request.materialId());
        Warehouse warehouse = getActiveWarehouseForUpdate(request.warehouseId());
        Inventory inventory = inventoryRepository
                .findForUpdate(material.getId(), warehouse.getId())
                .orElseGet(() -> createBalanceForPositiveAdjustment(material, warehouse, request.quantity()));

        if (request.quantity().signum() > 0) {
            ensureCapacity(warehouse, request.quantity());
        }

        BigDecimal newOnHand = inventory.getOnHand().add(request.quantity());
        if (newOnHand.signum() < 0) {
            throw new ConflictException("Insufficient on-hand stock for this adjustment");
        }
        if (newOnHand.compareTo(inventory.getReserved()) < 0) {
            throw new ConflictException("Adjustment would reduce on-hand stock below the reserved quantity");
        }

        inventory.adjustOnHand(request.quantity());
        Inventory saved = saveBalance(inventory);
        StockMovement movement = saveMovement(
                "ADJ", material.getId(), warehouse.getId(), request.quantity(),
                request.referenceNumber(), request.notes(), actor, request.movementDate());
        return operationResponse(saved, material, warehouse, movement);
    }

    @Transactional
    public InventoryOperationResponse reserve(InventoryQuantityRequest request, String actor) {
        MaterialReference material = getActiveMaterial(request.materialId());
        Warehouse warehouse = getActiveWarehouse(request.warehouseId());
        Inventory inventory = getBalanceForUpdate(material.getId(), warehouse.getId());

        if (inventory.available().compareTo(request.quantity()) < 0) {
            throw new ConflictException("Insufficient available stock to reserve the requested quantity");
        }

        inventory.reserve(request.quantity());
        Inventory saved = inventoryRepository.saveAndFlush(inventory);
        StockMovement movement = saveMovement(
                "RESERVE", material.getId(), warehouse.getId(), request.quantity(),
                request.referenceNumber(), request.notes(), actor, request.movementDate());
        return operationResponse(saved, material, warehouse, movement);
    }

    @Transactional
    public InventoryOperationResponse release(InventoryQuantityRequest request, String actor) {
        MaterialReference material = getActiveMaterial(request.materialId());
        Warehouse warehouse = getActiveWarehouse(request.warehouseId());
        Inventory inventory = getBalanceForUpdate(material.getId(), warehouse.getId());

        if (inventory.getReserved().compareTo(request.quantity()) < 0) {
            throw new ConflictException("Release quantity exceeds the currently reserved quantity");
        }

        inventory.release(request.quantity());
        Inventory saved = inventoryRepository.saveAndFlush(inventory);
        StockMovement movement = saveMovement(
                "RELEASE", material.getId(), warehouse.getId(), request.quantity().negate(),
                request.referenceNumber(), request.notes(), actor, request.movementDate());
        return operationResponse(saved, material, warehouse, movement);
    }

    private Inventory createBalanceForPositiveAdjustment(MaterialReference material,
            Warehouse warehouse, BigDecimal quantity) {
        if (quantity.signum() < 0) {
            throw new ConflictException("Inventory balance does not exist; add stock before removing it");
        }
        return new Inventory(material.getId(), warehouse.getId());
    }

    private Inventory saveBalance(Inventory inventory) {
        try {
            return inventoryRepository.saveAndFlush(inventory);
        } catch (DataIntegrityViolationException exception) {
            throw new ConflictException("Inventory balance was created by another request; retry the adjustment");
        }
    }

    private void ensureCapacity(Warehouse warehouse, BigDecimal incomingQuantity) {
        BigDecimal used = inventoryRepository.calculateOnHandByWarehouse(warehouse.getId());
        BigDecimal projected = (used == null ? BigDecimal.ZERO : used).add(incomingQuantity);
        if (projected.compareTo(warehouse.getCapacity()) > 0) {
            throw new ConflictException("Adjustment exceeds warehouse capacity; available capacity is "
                    + warehouse.getCapacity().subtract(used == null ? BigDecimal.ZERO : used));
        }
    }

    private Inventory getBalanceForUpdate(String materialId, String warehouseId) {
        return inventoryRepository.findForUpdate(materialId, warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory balance not found for material " + materialId
                                + " in warehouse " + warehouseId));
    }

    private MaterialReference resolveMaterial(String reference) {
        String normalized = reference.trim();
        return materialRepository.findById(normalized)
                .or(() -> materialRepository.findFirstByNameIgnoreCase(normalized))
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + normalized));
    }

    private MaterialReference getActiveMaterial(String reference) {
        MaterialReference material = resolveMaterial(reference);
        if (!material.isActive()) {
            throw new ConflictException("Material is inactive: " + material.getId());
        }
        return material;
    }

    private Warehouse getWarehouse(String id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found: " + id));
    }

    private Warehouse getActiveWarehouse(String id) {
        Warehouse warehouse = getWarehouse(id);
        requireActiveWarehouse(warehouse);
        return warehouse;
    }

    private Warehouse getActiveWarehouseForUpdate(String id) {
        Warehouse warehouse = warehouseRepository.findForUpdateById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found: " + id));
        requireActiveWarehouse(warehouse);
        return warehouse;
    }

    private void requireActiveWarehouse(Warehouse warehouse) {
        if (!warehouse.isActive()) {
            throw new ConflictException("Warehouse is inactive: " + warehouse.getId());
        }
    }

    private StockMovement saveMovement(String type, String materialId, String warehouseId,
            BigDecimal quantity, String referenceNumber, String notes, String actor,
            LocalDate movementDate) {
        StockMovement movement = new StockMovement(
                "MOV-" + UUID.randomUUID(),
                type,
                materialId,
                warehouseId,
                quantity,
                referenceNumber.trim(),
                normalizeOptional(notes),
                normalizeActor(actor),
                movementDate == null ? LocalDate.now() : movementDate);
        return movementRepository.saveAndFlush(movement);
    }

    private InventoryOperationResponse operationResponse(Inventory inventory,
            MaterialReference material, Warehouse warehouse, StockMovement movement) {
        return new InventoryOperationResponse(
                toInventoryResponse(inventory, material, warehouse),
                toMovementResponse(movement, material));
    }

    private InventoryResponse toInventoryResponse(Inventory inventory) {
        MaterialReference material = materialRepository.findById(inventory.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Material not found: " + inventory.getMaterialId()));
        return toInventoryResponse(inventory, material, getWarehouse(inventory.getWarehouseId()));
    }

    private InventoryResponse toInventoryResponse(Inventory inventory,
            MaterialReference material, Warehouse warehouse) {
        BigDecimal available = inventory.available();
        String status = available.signum() <= 0
                ? "Out of Stock"
                : available.compareTo(material.getReorderLevel()) <= 0 ? "Low Stock" : "Normal";
        return new InventoryResponse(
                inventory.getId(),
                material.getId(),
                material.getName(),
                warehouse.getId(),
                warehouse.getName(),
                inventory.getOnHand(),
                inventory.getReserved(),
                available,
                material.getReorderLevel(),
                material.getUnitOfMeasure(),
                material.getUnitCost(),
                inventory.getOnHand().multiply(material.getUnitCost()),
                status,
                inventory.getVersion(),
                inventory.getUpdatedAt());
    }

    private StockMovementResponse toMovementResponse(StockMovement movement) {
        MaterialReference material = materialRepository.findById(movement.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Material not found: " + movement.getMaterialId()));
        return toMovementResponse(movement, material);
    }

    private StockMovementResponse toMovementResponse(StockMovement movement,
            MaterialReference material) {
        return new StockMovementResponse(
                movement.getId(),
                movement.getType(),
                movement.getMaterialId(),
                material.getName(),
                movement.getQuantity(),
                movement.getQuantity(),
                movement.getWarehouseId(),
                movement.getWarehouseId(),
                movement.getReferenceNumber(),
                movement.getReferenceNumber(),
                movement.getMovementDate(),
                movement.getMovementDate(),
                movement.getProcessedBy(),
                movement.getProcessedBy(),
                movement.getNotes(),
                movement.getNotes(),
                movement.getCreatedAt());
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String normalizeActor(String actor) {
        String normalized = normalizeOptional(actor);
        return normalized == null ? "unknown" : normalized.substring(0, Math.min(100, normalized.length()));
    }
}
