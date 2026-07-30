package com.HumanResourceManagement.Attendance.Repository;

import com.HumanResourceManagement.Attendance.DTO.AttendanceResponse;
import com.HumanResourceManagement.Attendance.Model.Attendance;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<AttendanceResponse> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

}
