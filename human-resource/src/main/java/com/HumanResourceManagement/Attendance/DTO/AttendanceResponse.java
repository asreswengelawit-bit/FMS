package com.HumanResourceManagement.Attendance.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.HumanResourceManagement.Attendance.Model.Attendance;
// import com.HumanResourceManagement.Attendance.Model.Attendance;
import com.HumanResourceManagement.Attendance.Model.AttendanceStatus;

import lombok.Data;

@Data
public class AttendanceResponse {
    private Long id;
    private String employee;
    private LocalDate date;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private AttendanceStatus status;
    private LocalDateTime createdAt;

    public static AttendanceResponse fromAttendance(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setCheckInTime(attendance.getCheckInTime());
        response.setCheckOutTime(attendance.getCheckOutTime());
        response.setStatus(attendance.getStatus());
        response.setDate(attendance.getDate());
        if (attendance.getEmployee() != null) {
            response.setEmployee(
                    attendance.getEmployee().getFirstName() + " " +
                            attendance.getEmployee().getLastName());
        }
        response.setCreatedAt(attendance.getCreatedAt());

        return response;
    }
}
