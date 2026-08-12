package com.company.mms.goodsreceipt.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateGoodsReceiptRequest(
        @NotBlank(message = "Purchase order reference is required")
        @Size(max = 100, message = "PO reference must not exceed 100 characters")
        String purchaseOrderReference,

        @NotBlank(message = "Warehouse ID is required")
        String warehouseId,

        LocalDate receiptDate,

        String receivedBy,

        String notes,

        // Single line support for simplified frontend request
        String materialId,

        @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
        BigDecimal quantity,

        @Valid
        List<GoodsReceiptLineRequest> lines
) {
}
