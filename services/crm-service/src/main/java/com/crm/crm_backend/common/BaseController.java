package com.crm.crm_backend.common;

// common/BaseController.java

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

public abstract class BaseController<T, ID> {

    protected abstract BaseService<T, ID> getService();

    @GetMapping
    public ResponseEntity<ApiResponse<List<T>>> findAll() {
        List<T> entities = getService().findAll();
        return ResponseEntity.ok(ApiResponse.success(entities));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> findById(@PathVariable ID id) {
        T entity = getService().findById(id)
                .orElseThrow(() -> new RuntimeException("Entity not found"));
        return ResponseEntity.ok(ApiResponse.success(entity));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<T>> create(@Valid @RequestBody T entity) {
        T saved = getService().save(entity);
        return ResponseEntity.status(201).body(ApiResponse.success("Created", saved));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable ID id) {
        getService().deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}