package com.company.hrm.attendance.service;

import com.company.hrm.attendance.dto.ShiftRequest;
import com.company.hrm.attendance.dto.ShiftResponse;

import java.util.List;
import java.util.Optional;

public interface ShiftService {

    List<ShiftResponse> getAllShifts();

    Optional<ShiftResponse> getShiftById(Long id);

    ShiftResponse createShift(ShiftRequest request);

    ShiftResponse updateShift(Long id, ShiftRequest request);

    void deleteShift(Long id);
}