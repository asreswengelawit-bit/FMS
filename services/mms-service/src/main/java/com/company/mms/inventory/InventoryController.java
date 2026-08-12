package com.company.mms.inventory;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.mms.inventory.dto.AdjustInventoryRequest;
import com.company.mms.inventory.dto.InventoryOperationResponse;
import com.company.mms.inventory.dto.InventoryQuantityRequest;
import com.company.mms.inventory.dto.InventoryResponse;
import com.company.mms.stockmovement.dto.StockMovementResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'mms_user', 'inventory_manager', 'store_keeper', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'inventory_manager', 'store_keeper')";

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public List<InventoryResponse> findAll(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String materialId,
            @RequestParam(defaultValue = "false") boolean lowStock) {
        return service.findAll(warehouseId, materialId, lowStock);
    }

    @GetMapping("/{warehouseId}/{materialId}")
    @PreAuthorize(READ_ROLES)
    public InventoryResponse findOne(@PathVariable String warehouseId,
            @PathVariable String materialId) {
        return service.findOne(warehouseId, materialId);
    }

    @GetMapping("/movements")
    @PreAuthorize(READ_ROLES)
    public List<StockMovementResponse> findMovements(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String materialId,
            @RequestParam(required = false) String type) {
        return service.findMovements(warehouseId, materialId, type);
    }

    @PostMapping("/adjust")
    @PreAuthorize(WRITE_ROLES)
    public InventoryOperationResponse adjust(@Valid @RequestBody AdjustInventoryRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return service.adjust(request, actor(jwt));
    }

    @PostMapping("/reserve")
    @PreAuthorize(WRITE_ROLES)
    public InventoryOperationResponse reserve(@Valid @RequestBody InventoryQuantityRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return service.reserve(request, actor(jwt));
    }

    @PostMapping("/release")
    @PreAuthorize(WRITE_ROLES)
    public InventoryOperationResponse release(@Valid @RequestBody InventoryQuantityRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return service.release(request, actor(jwt));
    }

    private String actor(Jwt jwt) {
        if (jwt == null) return "system";
        String username = jwt.getClaimAsString("preferred_username");
        return username == null || username.isBlank() ? jwt.getSubject() : username;
    }
}
