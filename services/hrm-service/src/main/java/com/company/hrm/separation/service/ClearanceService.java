package com.company.hrm.separation.service;

import com.company.hrm.separation.dto.ClearanceRequest;
import com.company.hrm.separation.dto.ClearanceResponse;

import java.util.List;
import java.util.Optional;

public interface ClearanceService {

    List<ClearanceResponse> getAllClearances();

   ClearanceResponse getClearanceById(Long id);

    ClearanceResponse createClearance(ClearanceRequest request);

    ClearanceResponse updateClearance(Long id, ClearanceRequest request);

    void deleteClearance(Long id);
}