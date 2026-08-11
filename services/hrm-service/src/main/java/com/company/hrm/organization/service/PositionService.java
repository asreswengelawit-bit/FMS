package com.company.hrm.organization.service;

import com.company.hrm.organization.dto.PositionRequest;
import com.company.hrm.organization.dto.PositionResponse;

import java.util.List;

public interface PositionService {

    PositionResponse createPosition(PositionRequest requestDto);

    PositionResponse getPositionById(Long id);

    List<PositionResponse> getAllPositions();

    List<PositionResponse> getPositionsByDepartment(Long departmentId);

    PositionResponse updatePosition(Long id, PositionRequest requestDto);

    void deletePosition(Long id);
}