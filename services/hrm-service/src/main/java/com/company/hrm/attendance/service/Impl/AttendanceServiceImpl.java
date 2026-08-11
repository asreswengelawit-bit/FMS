package com.company.hrm.attendance.service.Impl;

import com.company.hrm.attendance.dto.AttendanceRequest;
import com.company.hrm.attendance.dto.AttendanceResponse;
import com.company.hrm.attendance.entity.Attendance;
import com.company.hrm.attendance.mapper.AttendanceMapper;
import com.company.hrm.attendance.repository.AttendanceRepository;
import com.company.hrm.attendance.service.AttendanceService;
import com.company.hrm.employee.entity.Employee;
import com.company.hrm.employee.repository.EmployeeRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceMapper attendanceMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(attendanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AttendanceResponse> getAttendanceById(Long id) {
        return attendanceRepository.findById(id).map(attendanceMapper::toResponse);
    }

    @Override
    public AttendanceResponse addNewAttendance(AttendanceRequest request) {
        // 1. Verify that the employee exists
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        // 2. Prevent duplicate entries for the exact same date
        if (attendanceRepository.findByEmployeeIdAndDate(request.getEmployeeId(), request.getDate()).isPresent()) {
            throw new IllegalStateException("An attendance record already exists for this employee on this date.");
        }

        // 3. Map the request to the entity with MapStruct
        Attendance attendance = attendanceMapper.toEntity(request);
        attendance.setEmployee(employee);

        // 4. Save to database
        Attendance savedAttendance = attendanceRepository.save(attendance);

        // 5. Convert entity to the response DTO and return
        return attendanceMapper.toResponse(savedAttendance);
    }

    @Override
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        // 1. Fetch existing attendance record
        Attendance existingAttendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Attendance record not found with id: " + id));

        // 2. Verify that the employee exists
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        // 3. Ensure no duplicate record exists for the same employee and date (excluding the current record)
        attendanceRepository.findByEmployeeIdAndDate(request.getEmployeeId(), request.getDate())
                .ifPresent(duplicate -> {
                    if (!duplicate.getId().equals(id)) {
                        throw new IllegalStateException("An attendance record already exists for this employee on this date.");
                    }
                });

        // 4. Update fields via mapper and set entity relationships
        attendanceMapper.updateEntityFromDto(request, existingAttendance);
        existingAttendance.setEmployee(employee);

        // 5. Save and return updated DTO
        Attendance updatedAttendance = attendanceRepository.save(existingAttendance);
        return attendanceMapper.toResponse(updatedAttendance);
    }

    @Override
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new EntityNotFoundException("Attendance record not found with id: " + id);
        }
        attendanceRepository.deleteById(id);
    }
}