package com.company.hrm.leave.service.Impl;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.employee.repository.EmployeeRepository;
import com.company.hrm.leave.dto.LeaveRequest;
import com.company.hrm.leave.dto.LeaveResponse;
import com.company.hrm.leave.entity.Leave;
import com.company.hrm.leave.entity.LeaveStatus;
import com.company.hrm.leave.mapper.LeaveMapper;
import com.company.hrm.leave.repository.LeaveRepository;
import com.company.hrm.leave.service.LeaveService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveMapper leaveMapper;

    @Override
    public LeaveResponse createLeaveRequest(LeaveRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        List<Leave> overlaps = leaveRepository.findOverlappingLeaves(
                request.getEmployeeId(), request.getStartDate(), request.getEndDate());
        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("Leave request overlaps with an existing pending/approved leave");
        }

        Leave leave = leaveMapper.toEntity(request);
        leave.setEmployee(employee);

        Leave saved = leaveRepository.save(leave);
        return leaveMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getAllLeaveRequests(LeaveStatus status) {
        List<Leave> leaves = (status != null)
                ? leaveRepository.findByStatus(status)
                : leaveRepository.findAll();
        return leaves.stream()
                .map(leaveMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveResponse getLeaveById(Long id) {
        return leaveMapper.toResponse(findLeaveOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeavesByEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new EntityNotFoundException("Employee not found with id: " + employeeId);
        }
        return leaveRepository.findByEmployeeId(employeeId).stream()
                .map(leaveMapper::toResponse)
                .toList();
    }

    private void validateDateRange(LocalDate start, LocalDate end) {
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
    }

    private Leave findLeaveOrThrow(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Leave request not found with id: " + id));
    }
}