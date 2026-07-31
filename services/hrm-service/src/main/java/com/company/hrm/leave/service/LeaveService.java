package com.company.hrm.leave.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.employee.repository.EmployeeRepository;
import com.company.hrm.leave.dto.LeaveRequest;
import com.company.hrm.leave.dto.LeaveResponse;
import com.company.hrm.leave.mapper.LeaveMapper;
import com.company.hrm.leave.entity.Leave;
import com.company.hrm.leave.entity.LeaveStatus;
import com.company.hrm.leave.repository.LeaveRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveService {
    final private LeaveRepository leaveRepository;
    final private EmployeeRepository employeeRepository;
    final private LeaveMapper leaveMapper;

    public LeaveResponse createLeaveRequest(LeaveRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Employee not found with id: " + request.getEmployeeId()));

        List<Leave> overlaps = leaveRepository.findOverlappingLeaves(
                request.getEmployeeId(), request.getStartDate(), request.getEndDate());
        if (!overlaps.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Leave request overlaps with an existing pending/approved leave");
        }
        Leave saved = leaveRepository.save(leaveMapper.toEntity(request, employee));
        return leaveMapper.toResponseDto(saved);
    }

    private void validateDateRange(LocalDate start, LocalDate end) {
        if (end.isBefore(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getAllLeaveRequests(LeaveStatus status) {
        List<Leave> leaves = (status != null)
                ? leaveRepository.findByStatus(status)
                : leaveRepository.findAll();
        return leaves.stream().map(leaveMapper::toResponseDto).toList();
    }

    @Transactional(readOnly = true)
    public LeaveResponse getLeaveById(Long id) {
        return leaveMapper.toResponseDto(findLeaveOrThrow(id));
    }

    private Leave findLeaveOrThrow(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Leave request not found with id " + id));
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId).stream()
                .map(leaveMapper::toResponseDto)
                .toList();
    }
}
