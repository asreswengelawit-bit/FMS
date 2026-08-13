package com.company.mms.supplier;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;
import com.company.mms.supplier.dto.CreateSupplierRequest;
import com.company.mms.supplier.dto.SupplierResponse;
import com.company.mms.supplier.dto.UpdateSupplierRequest;

@Service
@Transactional(readOnly = true)
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public List<SupplierResponse> findAll(String status) {
        String normalizedStatus = normalizeOptional(status);
        List<Supplier> suppliers = normalizedStatus == null
                ? repository.findAllByOrderByNameAsc()
                : repository.findByStatusOrderByNameAsc(normalizedStatus);
        return suppliers.stream().map(this::toResponse).toList();
    }

    public SupplierResponse findById(String id) {
        return toResponse(getSupplier(id));
    }

    @Transactional
    public SupplierResponse create(CreateSupplierRequest request) {
        String id = request.id().trim();
        String email = normalizeOptional(request.email());
        if (repository.existsById(id)) {
            throw new ConflictException("Supplier code already exists: " + id);
        }
        ensureEmailIsAvailable(email, null);

        Supplier supplier = new Supplier(id, request.name().trim(), request.contactPerson().trim(),
                email, normalizeOptional(request.phoneNumber()), normalizeOptional(request.address()),
                normalizeStatus(request.status()));
        try {
            return toResponse(repository.saveAndFlush(supplier));
        } catch (DataIntegrityViolationException exception) {
            throw new ConflictException("Supplier code or email already exists");
        }
    }

    @Transactional
    public SupplierResponse update(String id, UpdateSupplierRequest request) {
        Supplier supplier = getSupplier(id);
        String email = normalizeOptional(request.email());
        ensureEmailIsAvailable(email, id);
        supplier.update(request.name().trim(), request.contactPerson().trim(), email,
                normalizeOptional(request.phoneNumber()), normalizeOptional(request.address()),
                normalizeStatus(request.status()));
        try {
            return toResponse(repository.saveAndFlush(supplier));
        } catch (DataIntegrityViolationException exception) {
            throw new ConflictException("Supplier email already exists");
        }
    }

    @Transactional
    public void delete(String id) {
        Supplier supplier = getSupplier(id);
        supplier.deactivate();
        repository.save(supplier);
    }

    private Supplier getSupplier(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }

    private void ensureEmailIsAvailable(String email, String currentId) {
        if (email == null) {
            return;
        }
        repository.findByEmailIgnoreCase(email)
                .filter(supplier -> !supplier.getId().equals(currentId))
                .ifPresent(supplier -> { throw new ConflictException("Supplier email already exists: " + email); });
    }

    private String normalizeStatus(String status) {
        String normalized = normalizeOptional(status);
        return normalized == null ? "ACTIVE" : normalized;
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private SupplierResponse toResponse(Supplier supplier) {
        return new SupplierResponse(supplier.getId(), supplier.getName(), supplier.getContactPerson(),
                supplier.getEmail(), supplier.getPhoneNumber(), supplier.getAddress(), supplier.getStatus(),
                supplier.getCreatedAt(), supplier.getUpdatedAt());
    }
}
