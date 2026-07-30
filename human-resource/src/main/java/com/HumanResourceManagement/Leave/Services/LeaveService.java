package com.HumanResourceManagement.Leave.Services;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Employee.Repository.EmployeeRepository;
import com.HumanResourceManagement.Leave.DTO.LeaveRequest;
import com.HumanResourceManagement.Leave.DTO.LeaveResponse;
import com.HumanResourceManagement.Leave.Mapper.LeaveMapper;
import com.HumanResourceManagement.Leave.Model.Leave;
import com.HumanResourceManagement.Leave.Model.LeaveStatus;
import com.HumanResourceManagement.Leave.Repository.LeaveRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaveService {
    final private LeaveRepository leaveRepository;
    final private EmployeeRepository employeeRepository;
    final private LeaveMapper leaveMapper;

    public LeaveResponse createLeaveRequest(LeaveRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "employee doesnot exist by id: " + request.getEmployeeId()));

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

    public List<LeaveResponse> getAllLeaveRequests(LeaveStatus status) {
        List<Leave> leaves = (status != null)
                ? leaveRepository.findByStatus(status)
                : leaveRepository.findAll();
        return leaves.stream().map(leaveMapper::toResponseDto).toList();
    }

    public LeaveResponse getLeaveById(Long id) {
        return leaveMapper.toResponseDto(findLeaveOrThrow(id));
    }

    private Leave findLeaveOrThrow(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Leave request not found with id " + id));
    }

    public List<LeaveResponse> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId).stream()
                .map(leaveMapper::toResponseDto)
                .toList();
    }
}