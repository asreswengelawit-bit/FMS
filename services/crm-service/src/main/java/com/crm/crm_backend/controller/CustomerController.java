package com.crm.crm_backend.controller;

// controller/CustomerController.java

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.CustomerCreateDTO;
import com.crm.crm_backend.dto.request.CustomerUpdateDTO;
import com.crm.crm_backend.dto.response.CustomerResponseDTO;
import com.crm.crm_backend.model.enums.CustomerStatus;
import com.crm.crm_backend.model.enums.CustomerType;
import com.crm.crm_backend.service.core.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping({"/api/customers", "/api/crm/customers"})
@RequiredArgsConstructor
public class CustomerController  {

    private final CustomerService customerService;


    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> createCustomer(
            @Valid @RequestBody CustomerCreateDTO dto) {
        CustomerResponseDTO customer = customerService.createCustomer(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer created successfully", customer));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> getCustomer(@PathVariable Long id) {
        CustomerResponseDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateDTO dto) {
        CustomerResponseDTO customer = customerService.updateCustomer(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", customer));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user')")
    public ResponseEntity<ApiResponse<Page<CustomerResponseDTO>>> getAllCustomers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) CustomerStatus status,
            @RequestParam(required = false) CustomerType customerType,
            @RequestParam(required = false) Long territoryId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdTo,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<CustomerResponseDTO> customers = customerService.searchCustomers(
                q, status, customerType, territoryId, city, country, createdFrom, createdTo, pageable);
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer soft-deleted successfully", null));
    }
}
