package com.company.mms.goodsreceipt;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.mms.goodsreceipt.dto.CreateGoodsReceiptRequest;
import com.company.mms.goodsreceipt.dto.GoodsReceiptLineRequest;
import com.company.mms.goodsreceipt.dto.GoodsReceiptLineResponse;
import com.company.mms.goodsreceipt.dto.GoodsReceiptResponse;
import com.company.mms.inventory.Inventory;
import com.company.mms.inventory.InventoryRepository;
import com.company.mms.inventory.MaterialReference;
import com.company.mms.inventory.MaterialReferenceRepository;
import com.company.mms.shared.BadRequestException;
import com.company.mms.shared.ResourceNotFoundException;
import com.company.mms.stockmovement.StockMovement;
import com.company.mms.stockmovement.StockMovementRepository;
import com.company.mms.warehouse.Warehouse;
import com.company.mms.warehouse.WarehouseRepository;

@Service
@Transactional(readOnly = true)
public class GoodsReceiptService {

    private final GoodsReceiptRepository repository;
    private final WarehouseRepository warehouseRepository;
    private final MaterialReferenceRepository materialRepository;
    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository movementRepository;

    public GoodsReceiptService(GoodsReceiptRepository repository,
            WarehouseRepository warehouseRepository,
            MaterialReferenceRepository materialRepository,
            InventoryRepository inventoryRepository,
            StockMovementRepository movementRepository) {
        this.repository = repository;
        this.warehouseRepository = warehouseRepository;
        this.materialRepository = materialRepository;
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
    }

    public List<GoodsReceiptResponse> findAll(String warehouseId, String poRef) {
        return repository.search(warehouseId, poRef)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public GoodsReceiptResponse findById(String id) {
        GoodsReceipt receipt = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goods Receipt not found: " + id));
        return toResponse(receipt);
    }

    @Transactional
    public GoodsReceiptResponse create(CreateGoodsReceiptRequest request, String actor) {
        Warehouse warehouse = warehouseRepository.findById(request.warehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found: " + request.warehouseId()));

        List<GoodsReceiptLineRequest> lineRequests = new ArrayList<>();
        if (request.lines() != null && !request.lines().isEmpty()) {
            lineRequests.addAll(request.lines());
        } else if (request.materialId() != null && request.quantity() != null) {
            lineRequests.add(new GoodsReceiptLineRequest(request.materialId(), request.quantity(), null));
        } else {
            throw new BadRequestException("At least one material item line must be provided for goods receipt");
        }

        String receiptId = "GRN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDate receiptDate = request.receiptDate() == null ? LocalDate.now() : request.receiptDate();
        String receivedBy = request.receivedBy() != null && !request.receivedBy().isBlank() ? request.receivedBy() : actor;

        GoodsReceipt receipt = new GoodsReceipt(
                receiptId,
                request.purchaseOrderReference().trim(),
                warehouse.getId(),
                receiptDate,
                receivedBy,
                request.notes()
        );

        for (GoodsReceiptLineRequest lineReq : lineRequests) {
            MaterialReference material = resolveMaterial(lineReq.materialId());
            BigDecimal qty = lineReq.quantity();
            BigDecimal unitCost = lineReq.unitCost() == null ? material.getUnitCost() : lineReq.unitCost();

            GoodsReceiptLine line = new GoodsReceiptLine(material.getId(), qty, unitCost);
            receipt.addLine(line);

            // Update inventory on-hand balance
            Inventory inventory = inventoryRepository.findForUpdate(material.getId(), warehouse.getId())
                    .orElseGet(() -> new Inventory(material.getId(), warehouse.getId()));
            inventory.adjustOnHand(qty);
            inventoryRepository.saveAndFlush(inventory);

            // Record Goods Receipt stock movement
            StockMovement movement = new StockMovement(
                    "MOV-" + UUID.randomUUID(),
                    "GR",
                    material.getId(),
                    warehouse.getId(),
                    qty,
                    request.purchaseOrderReference().trim(),
                    "Goods received via " + receiptId + (request.notes() != null ? ": " + request.notes() : ""),
                    receivedBy,
                    receiptDate
            );
            movementRepository.saveAndFlush(movement);
        }

        GoodsReceipt saved = repository.save(receipt);
        return toResponse(saved);
    }

    private MaterialReference resolveMaterial(String reference) {
        String normalized = reference.trim();
        return materialRepository.findById(normalized)
                .or(() -> materialRepository.findFirstByNameIgnoreCase(normalized))
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + normalized));
    }

    private GoodsReceiptResponse toResponse(GoodsReceipt receipt) {
        Warehouse warehouse = warehouseRepository.findById(receipt.getWarehouseId()).orElse(null);
        String warehouseName = warehouse != null ? warehouse.getName() : receipt.getWarehouseId();

        List<GoodsReceiptLineResponse> lineResponses = receipt.getLines().stream().map(line -> {
            MaterialReference mat = materialRepository.findById(line.getMaterialId()).orElse(null);
            String name = mat != null ? mat.getName() : line.getMaterialId();
            return new GoodsReceiptLineResponse(line.getId(), line.getMaterialId(), name, line.getQuantity(), line.getUnitCost());
        }).toList();

        return new GoodsReceiptResponse(
                receipt.getId(),
                receipt.getPurchaseOrderReference(),
                receipt.getWarehouseId(),
                warehouseName,
                receipt.getReceiptDate(),
                receipt.getReceivedBy(),
                receipt.getStatus(),
                receipt.getNotes(),
                receipt.getCreatedAt(),
                lineResponses
        );
    }
}
