package com.company.mms.requisition;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.mms.inventory.Inventory;
import com.company.mms.inventory.InventoryRepository;
import com.company.mms.inventory.MaterialReference;
import com.company.mms.inventory.MaterialReferenceRepository;
import com.company.mms.requisition.dto.CreateRequisitionRequest;
import com.company.mms.requisition.dto.RequisitionResponse;
import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;
import com.company.mms.stockmovement.StockMovement;
import com.company.mms.stockmovement.StockMovementRepository;

@Service
@Transactional(readOnly = true)
public class RequisitionService {

    private final RequisitionRepository repository;
    private final MaterialReferenceRepository materialRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository movementRepository;

    public RequisitionService(RequisitionRepository repository,
            MaterialReferenceRepository materialRepository,
            InventoryRepository inventoryRepository,
            StockMovementRepository movementRepository) {
        this.repository = repository;
        this.materialRepository = materialRepository;
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
    }

    public List<RequisitionResponse> findAll(String status, String department) {
        String stat = status != null && !status.isBlank() ? status.trim() : null;
        String dept = department != null && !department.isBlank() ? department.trim() : null;
        return repository.search(stat, dept)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RequisitionResponse findById(String id) {
        Requisition requisition = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requisition not found: " + id));
        return toResponse(requisition);
    }

    @Transactional
    public RequisitionResponse create(CreateRequisitionRequest request) {
        String targetMaterial = request.materialId() != null && !request.materialId().isBlank()
                ? request.materialId()
                : request.item();

        MaterialReference material = resolveMaterial(targetMaterial);
        BigDecimal qty = request.quantity() != null ? request.quantity() : request.qty();

        if (qty == null || qty.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ConflictException("Requisition quantity must be greater than zero");
        }

        String reqId = "REQ-" + System.currentTimeMillis();
        LocalDate reqDate = request.requiredDate() != null ? request.requiredDate()
                : request.date() != null ? request.date() : LocalDate.now();

        Requisition requisition = new Requisition(
                reqId,
                request.requestedBy().trim(),
                request.department().trim(),
                material.getId(),
                qty,
                reqDate,
                request.priority(),
                "Pending"
        );

        Requisition saved = repository.save(requisition);
        return toResponse(saved);
    }

    @Transactional
    public RequisitionResponse issue(String id, String actor) {
        Requisition requisition = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requisition not found: " + id));

        if ("Issued".equalsIgnoreCase(requisition.getStatus()) || "ISSUED".equalsIgnoreCase(requisition.getStatus())) {
            throw new ConflictException("Requisition " + id + " has already been issued");
        }

        MaterialReference material = materialRepository.findById(requisition.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + requisition.getMaterialId()));

        // Find best warehouse with available stock
        List<Inventory> balances = inventoryRepository.findByMaterialIdOrderByWarehouseIdAsc(material.getId());
        Inventory targetInventory = balances.stream()
                .filter(b -> b.available().compareTo(requisition.getQuantity()) >= 0)
                .findFirst()
                .orElseThrow(() -> new ConflictException("Insufficient available stock across warehouses for material " + material.getName()));

        // Deduct inventory
        targetInventory.adjustOnHand(requisition.getQuantity().negate());
        inventoryRepository.saveAndFlush(targetInventory);

        // Record Goods Issue stock movement
        StockMovement movement = new StockMovement(
                "MOV-" + UUID.randomUUID(),
                "GI",
                material.getId(),
                targetInventory.getWarehouseId(),
                requisition.getQuantity().negate(),
                requisition.getId(),
                "Issued to " + requisition.getDepartment() + " (" + requisition.getRequestedBy() + ")",
                actor != null && !actor.isBlank() ? actor : "system",
                LocalDate.now()
        );
        movementRepository.saveAndFlush(movement);

        requisition.issue();
        Requisition saved = repository.save(requisition);
        return toResponse(saved);
    }

    @Transactional
    public RequisitionResponse reject(String id) {
        Requisition requisition = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requisition not found: " + id));
        requisition.reject();
        Requisition saved = repository.save(requisition);
        return toResponse(saved);
    }

    private MaterialReference resolveMaterial(String reference) {
        String normalized = reference.trim();
        return materialRepository.findById(normalized)
                .or(() -> materialRepository.findFirstByNameIgnoreCase(normalized))
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + normalized));
    }

    private RequisitionResponse toResponse(Requisition req) {
        MaterialReference mat = materialRepository.findById(req.getMaterialId()).orElse(null);
        String name = mat != null ? mat.getName() : req.getMaterialId();
        String formattedDate = req.getRequiredDate() != null ? req.getRequiredDate().toString() : "";

        return new RequisitionResponse(
                req.getId(),
                req.getRequestedBy(),
                req.getDepartment(),
                req.getMaterialId(),
                name,
                name,
                req.getQuantity(),
                req.getQuantity(),
                req.getRequiredDate(),
                formattedDate,
                req.getPriority(),
                req.getStatus(),
                req.getCreatedAt(),
                req.getUpdatedAt()
        );
    }
}
