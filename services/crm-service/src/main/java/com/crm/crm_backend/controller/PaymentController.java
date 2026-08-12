package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.PaymentCreateDTO;
import com.crm.crm_backend.dto.request.PaymentUpdateDTO;
import com.crm.crm_backend.dto.response.PaymentResponseDTO;
import com.crm.crm_backend.service.core.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> createPayment(
            @Valid @RequestBody PaymentCreateDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment created", paymentService.createPayment(dto)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user', 'fms_user')")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> getPayment(
            @PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.success(paymentService.getPayment(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<Page<PaymentResponseDTO>>> getAllPayments(
            Pageable pageable) {

        return ResponseEntity.ok(ApiResponse.success(paymentService.getAllPayments(pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentUpdateDTO dto) {

        return ResponseEntity.ok(ApiResponse.success(paymentService.updatePayment(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deletePayment(
            @PathVariable Long id) {

        paymentService.deletePayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment deleted", null));
    }
}
