package com.company.mms.warehouse;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;
import com.company.mms.warehouse.dto.CreateWarehouseRequest;
import com.company.mms.warehouse.dto.UpdateWarehouseRequest;
import com.company.mms.warehouse.dto.WarehouseResponse;

@Service
@Transactional(readOnly = true)
public class WarehouseService {

    private final WarehouseRepository repository;

    public WarehouseService(WarehouseRepository repository) {
        this.repository = repository;
    }

    public List<WarehouseResponse> findAll(Boolean active) {
        List<Warehouse> warehouses = active == null
                ? repository.findAllByOrderByNameAsc()
                : repository.findByActiveOrderByNameAsc(active);
        return warehouses.stream().map(this::toResponse).toList();
    }

    public WarehouseResponse findById(String id) {
        return toResponse(getWarehouse(id));
    }

    @Transactional
    public WarehouseResponse create(CreateWarehouseRequest request) {
        String id = request.id().trim();
        if (repository.existsById(id)) {
            throw new ConflictException("Warehouse code already exists: " + id);
        }

        Warehouse warehouse = new Warehouse(
                id,
                request.name().trim(),
                request.location().trim(),
                request.type().trim(),
                request.capacity(),
                request.manager().trim(),
                request.active() == null || request.active());
        try {
            return toResponse(repository.saveAndFlush(warehouse));
        } catch (DataIntegrityViolationException exception) {
            throw new ConflictException("Warehouse code already exists: " + id);
        }
    }

    @Transactional
    public WarehouseResponse update(String id, UpdateWarehouseRequest request) {
        Warehouse warehouse = getWarehouse(id);
        warehouse.update(
                request.name().trim(),
                request.location().trim(),
                request.type().trim(),
                request.capacity(),
                request.manager().trim(),
                request.active());
        return toResponse(repository.saveAndFlush(warehouse));
    }

    @Transactional
    public void delete(String id) {
        Warehouse warehouse = getWarehouse(id);
        try {
            repository.delete(warehouse);
            repository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new ConflictException("Warehouse cannot be deleted because it contains inventory or transactions");
        }
    }

    private Warehouse getWarehouse(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found: " + id));
    }

    private WarehouseResponse toResponse(Warehouse warehouse) {
        BigDecimal used = repository.calculateUsedCapacity(warehouse.getId());
        return new WarehouseResponse(
                warehouse.getId(),
                warehouse.getName(),
                warehouse.getLocation(),
                warehouse.getCapacity(),
                used == null ? BigDecimal.ZERO : used,
                repository.countInventoryItems(warehouse.getId()),
                warehouse.getManager(),
                warehouse.getType(),
                warehouse.isActive(),
                warehouse.getCreatedAt(),
                warehouse.getUpdatedAt());
    }
}
