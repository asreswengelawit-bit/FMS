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

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getAllLeaveRequests(LeaveStatus status) {
        List<Leave> leaves = (status != null)
                ? leaveRepository.findByStatus(status)
                : leaveRepository.findAll();
        return leaves.stream().map(leaveMapper::toResponseDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveResponse getLeaveById(Long id) {
        return leaveMapper.toResponseDto(findLeaveOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId).stream()
                .map(leaveMapper::toResponseDto)
                .toList();
    }

    private void validateDateRange(LocalDate start, LocalDate end) {
        if (end.isBefore(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
    }

    private Leave findLeaveOrThrow(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Leave request not found with id " + id));
    }
}