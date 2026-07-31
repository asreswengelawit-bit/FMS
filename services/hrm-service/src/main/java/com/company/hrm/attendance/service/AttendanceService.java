package com.company.hrm.attendance.service;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.company.hrm.attendance.dto.AttendanceRequest;
import com.company.hrm.attendance.dto.AttendanceResponse;
import com.company.hrm.attendance.entity.Attendance;
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

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllAttendance() {
        return attendanceRepository.findAll().stream().map(AttendanceResponse::fromAttendance)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<AttendanceResponse> getAttendanceById(Long id) {
        return attendanceRepository.findById(id).map(AttendanceResponse::fromAttendance);
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

        // 3. Map properties from request directly onto the entity instance
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(request.getDate());
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setStatus(request.getStatus());

        // 4. Save to database
        Attendance savedAttendance = attendanceRepository.save(attendance);

        // 5. Convert entity to your exact Response format and return
        return AttendanceResponse.fromAttendance(savedAttendance);
    }
}
