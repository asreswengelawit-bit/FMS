package com.company.hrm.attendance.service.Impl;

import com.company.hrm.attendance.dto.ShiftRequest;
import com.company.hrm.attendance.dto.ShiftResponse;
import com.company.hrm.attendance.entity.Shift;
import com.company.hrm.attendance.mapper.ShiftMapper;
import com.company.hrm.attendance.repository.ShiftRepository;
import com.company.hrm.attendance.service.ShiftService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;
    private final ShiftMapper shiftMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ShiftResponse> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(shiftMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ShiftResponse> getShiftById(Long id) {
        return shiftRepository.findById(id).map(shiftMapper::toResponse);
    }

    @Override
    public ShiftResponse createShift(ShiftRequest request) {
        if (shiftRepository.existsByName(request.getName())) {
            throw new IllegalStateException("A shift with the name '" + request.getName() + "' already exists.");
        }

        Shift shift = shiftMapper.toEntity(request);
        Shift savedShift = shiftRepository.save(shift);
        return shiftMapper.toResponse(savedShift);
    }

    @Override
    public ShiftResponse updateShift(Long id, ShiftRequest request) {
        Shift existingShift = shiftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Shift not found with id: " + id));

        if (shiftRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new IllegalStateException("A shift with the name '" + request.getName() + "' already exists.");
        }

        shiftMapper.updateEntityFromDto(request, existingShift);
        Shift updatedShift = shiftRepository.save(existingShift);
        return shiftMapper.toResponse(updatedShift);
    }

    @Override
    public void deleteShift(Long id) {
        if (!shiftRepository.existsById(id)) {
            throw new EntityNotFoundException("Shift not found with id: " + id);
        }
        shiftRepository.deleteById(id);
    }
}