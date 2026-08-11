package com.company.hrm.attendance.service;

import com.company.hrm.attendance.dto.AttendanceRequest;
import com.company.hrm.attendance.dto.AttendanceResponse;

import java.util.List;
import java.util.Optional;

public interface AttendanceService {

    List<AttendanceResponse> getAllAttendance();

    Optional<AttendanceResponse> getAttendanceById(Long id);

    AttendanceResponse addNewAttendance(AttendanceRequest request);
}