package com.HumanResourceManagement.Organization.Controller;

import com.HumanResourceManagement.Organization.DTO.PositionRequest;
import com.HumanResourceManagement.Organization.DTO.PositionResponse;
import com.HumanResourceManagement.Organization.Service.PositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @PostMapping
    public ResponseEntity<PositionResponse> createPosition(@Valid @RequestBody PositionRequest requestDto) {
        PositionResponse createdPosition = positionService.createPosition(requestDto);
        return new ResponseEntity<>(createdPosition, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PositionResponse> getPositionById(@PathVariable Long id) {
        return ResponseEntity.ok(positionService.getPositionById(id));
    }

    @GetMapping
    public ResponseEntity<List<PositionResponse>> getAllPositions() {
        return ResponseEntity.ok(positionService.getAllPositions());
    }

    // @GetMapping("/department/{departmentId}")
    // public ResponseEntity<List<PositionResponse>>
    // getPositionsByDepartment(@PathVariable Long departmentId) {
    // return
    // ResponseEntity.ok(positionService.getPositionsByDepartment(departmentId));
    // }

    @PutMapping("/{id}")
    public ResponseEntity<PositionResponse> updatePosition(
            @PathVariable Long id,
            @Valid @RequestBody PositionRequest requestDto) {
        return ResponseEntity.ok(positionService.updatePosition(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return ResponseEntity.noContent().build();
    }
}