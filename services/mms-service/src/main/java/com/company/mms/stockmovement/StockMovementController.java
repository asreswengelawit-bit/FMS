package com.company.mms.stockmovement;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.mms.inventory.InventoryService;
import com.company.mms.stockmovement.dto.StockMovementResponse;

@RestController
@RequestMapping("/api/v1/stock-movements")
public class StockMovementController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'mms_user', 'inventory_manager', 'store_keeper', 'viewer')";

    private final InventoryService inventoryService;

    public StockMovementController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public List<StockMovementResponse> search(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String materialId,
            @RequestParam(required = false) String type) {
        return inventoryService.findMovements(warehouseId, materialId, type);
    }
}
