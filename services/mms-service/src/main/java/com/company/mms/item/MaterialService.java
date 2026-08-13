package com.company.mms.item;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.mms.inventory.Inventory;
import com.company.mms.inventory.InventoryRepository;
import com.company.mms.item.dto.CreateMaterialRequest;
import com.company.mms.item.dto.MaterialResponse;
import com.company.mms.item.dto.UpdateMaterialRequest;
import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class MaterialService {

    private final MaterialRepository repository;
    private final InventoryRepository inventoryRepository;

    public MaterialService(MaterialRepository repository, InventoryRepository inventoryRepository) {
        this.repository = repository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<MaterialResponse> findAll(Boolean active, String category, String search) {
        String cat = category != null && !category.isBlank() ? category.trim() : null;
        String q = search != null && !search.isBlank() ? search.trim() : null;

        return repository.findAllByOrderByNameAsc()
                .stream()
                .filter(material -> active == null || material.isActive() == active)
                .filter(material -> cat == null || material.getCategory().equalsIgnoreCase(cat))
                .filter(material -> q == null || matchesSearch(material, q))
                .map(this::toResponse)
                .toList();
    }

    private boolean matchesSearch(Material material, String search) {
        String query = search.toLowerCase(Locale.ROOT);
        return material.getName().toLowerCase(Locale.ROOT).contains(query)
                || material.getId().toLowerCase(Locale.ROOT).contains(query);
    }

    public MaterialResponse findById(String id) {
        Material material = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + id));
        return toResponse(material);
    }

    @Transactional
    public MaterialResponse create(CreateMaterialRequest request) {
        String id = request.id().trim();
        if (repository.existsById(id)) {
            throw new ConflictException("Material with code " + id + " already exists");
        }

        Material material = new Material(
                id,
                request.name().trim(),
                request.category().trim(),
                request.unitOfMeasure().trim(),
                request.unitCost(),
                request.reorderLevel(),
                true
        );

        Material saved = repository.save(material);
        return toResponse(saved);
    }

    @Transactional
    public MaterialResponse update(String id, UpdateMaterialRequest request) {
        Material material = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + id));

        material.update(
                request.name(),
                request.category(),
                request.unitOfMeasure(),
                request.unitCost(),
                request.reorderLevel(),
                request.active()
        );

        Material updated = repository.save(material);
        return toResponse(updated);
    }

    @Transactional
    public void delete(String id) {
        Material material = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found: " + id));
        material.deactivate();
        repository.save(material);
    }

    public MaterialResponse toResponse(Material material) {
        List<Inventory> balances = inventoryRepository.findByMaterialIdOrderByWarehouseIdAsc(material.getId());
        BigDecimal totalOnHand = balances.stream()
                .map(Inventory::getOnHand)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalReserved = balances.stream()
                .map(Inventory::getReserved)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal available = totalOnHand.subtract(totalReserved);

        String mainWarehouse = balances.isEmpty() ? "WH-001" : balances.get(0).getWarehouseId();
        String status = totalOnHand.compareTo(BigDecimal.ZERO) <= 0
                ? "Out of Stock"
                : totalOnHand.compareTo(material.getReorderLevel()) <= 0 ? "Low Stock" : "Normal";

        return new MaterialResponse(
                material.getId(),
                material.getName(),
                material.getCategory(),
                material.getUnitOfMeasure(),
                material.getUnitOfMeasure(),
                material.getUnitCost(),
                material.getReorderLevel(),
                totalOnHand,
                totalReserved,
                available,
                mainWarehouse,
                status,
                material.isActive(),
                material.getCreatedAt(),
                material.getUpdatedAt()
        );
    }
}
