package com.company.mms.inventory;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.mms.inventory.dto.InventoryResponse;

@RestController
@RequestMapping("/api/v1/stock-balances")
public class StockBalanceController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'mms_user', 'inventory_manager', 'store_keeper', 'viewer')";

    private final InventoryService service;

    public StockBalanceController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public List<InventoryResponse> findAll(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String itemId,
            @RequestParam(required = false) String materialId,
            @RequestParam(defaultValue = "false") boolean lowStock) {
        String targetMaterial = itemId != null && !itemId.isBlank() ? itemId : materialId;
        return service.findAll(warehouseId, targetMaterial, lowStock);
    }
}
