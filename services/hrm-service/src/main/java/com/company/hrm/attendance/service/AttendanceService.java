package com.company.hrm.attendance.service;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.company.hrm.attendance.dto.AttendanceRequest;
import com.company.hrm.attendance.dto.AttendanceResponse;
import com.company.hrm.attendance.entity.Attendance;
import com.company.hrm.attendance.mapper.AttendanceMapper;
import com.company.hrm.attendance.repository.AttendanceRepository;
import com.company.hrm.employee.entity.Employee;
import com.company.hrm.employee.repository.EmployeeRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceMapper attendanceMapper;

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(attendanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<AttendanceResponse> getAttendanceById(Long id) {
        return attendanceRepository.findById(id).map(attendanceMapper::toResponse);
    }

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
}
