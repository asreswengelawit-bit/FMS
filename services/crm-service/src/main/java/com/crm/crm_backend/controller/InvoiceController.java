package com.crm.crm_backend.controller;

import com.crm.crm_backend.common.ApiResponse;
import com.crm.crm_backend.dto.request.InvoiceCreateDTO;
import com.crm.crm_backend.dto.request.InvoiceUpdateDTO;
import com.crm.crm_backend.dto.response.InvoiceResponseDTO;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.service.core.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user', 'fms_user')")
    public ResponseEntity<ApiResponse<InvoiceResponseDTO>> createInvoice(
            @Valid @RequestBody InvoiceCreateDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Invoice created", invoiceService.createInvoice(dto)));
    }

    @GetMapping("/export.csv")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user', 'fms_user')")
    public ResponseEntity<String> exportInvoices(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long salesOrderId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate invoiceFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate invoiceTo) {

        String csv = invoiceService.exportInvoicesCsv(
                q, status, customerId, salesOrderId, dueFrom, dueTo, invoiceFrom, invoiceTo);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoices.csv\"")
                .contentType(new MediaType("text", "csv"))
                .body(csv);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user', 'fms_user')")
    public ResponseEntity<ApiResponse<InvoiceResponseDTO>> getInvoice(
            @PathVariable Long id) {

        return ResponseEntity.ok(ApiResponse.success(invoiceService.getInvoice(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'crm_user', 'fms_user')")
    public ResponseEntity<ApiResponse<Page<InvoiceResponseDTO>>> getAllInvoices(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long salesOrderId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueTo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate invoiceFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate invoiceTo,
            Pageable pageable) {

        return ResponseEntity.ok(ApiResponse.success(
                invoiceService.searchInvoices(
                        q, status, customerId, salesOrderId, dueFrom, dueTo, invoiceFrom, invoiceTo, pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'fms_user', 'crm_user')")
    public ResponseEntity<ApiResponse<InvoiceResponseDTO>> updateInvoice(
            @PathVariable Long id,
            @Valid @RequestBody InvoiceUpdateDTO dto) {

        return ResponseEntity.ok(ApiResponse.success(invoiceService.updateInvoice(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(
            @PathVariable Long id) {

        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice deleted", null));
    }
}
