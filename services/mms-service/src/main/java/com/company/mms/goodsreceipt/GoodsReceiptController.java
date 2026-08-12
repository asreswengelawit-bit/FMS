package com.company.mms.goodsreceipt;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.company.mms.goodsreceipt.dto.CreateGoodsReceiptRequest;
import com.company.mms.goodsreceipt.dto.GoodsReceiptResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/goods-receipts")
public class GoodsReceiptController {

    private static final String READ_ROLES =
            "hasAnyRole('admin', 'mms_user', 'inventory_manager', 'store_keeper', 'viewer')";
    private static final String WRITE_ROLES =
            "hasAnyRole('admin', 'inventory_manager', 'store_keeper')";

    private final GoodsReceiptService service;

    public GoodsReceiptController(GoodsReceiptService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize(READ_ROLES)
    public List<GoodsReceiptResponse> findAll(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String poRef) {
        return service.findAll(warehouseId, poRef);
    }

    @GetMapping("/{id}")
    @PreAuthorize(READ_ROLES)
    public GoodsReceiptResponse findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize(WRITE_ROLES)
    public ResponseEntity<GoodsReceiptResponse> create(
            @Valid @RequestBody CreateGoodsReceiptRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        GoodsReceiptResponse created = service.create(request, actor(jwt));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    private String actor(Jwt jwt) {
        if (jwt == null) return "system";
        String username = jwt.getClaimAsString("preferred_username");
        return username == null || username.isBlank() ? jwt.getSubject() : username;
    }
}
