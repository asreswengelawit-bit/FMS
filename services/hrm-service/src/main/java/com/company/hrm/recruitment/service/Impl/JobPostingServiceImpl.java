package com.company.hrm.recruitment.service.Impl;

import com.company.hrm.recruitment.service.JobPostingService;
import com.company.hrm.employee.entity.Employee;
import com.company.hrm.employee.repository.EmployeeRepository;
import com.company.hrm.department.entity.Department;
import com.company.hrm.organization.entity.Position;
import com.company.hrm.department.repository.DepartmentRepository;
import com.company.hrm.organization.repository.PositionRepository;
import com.company.hrm.recruitment.entity.JobPosting;
import com.company.hrm.recruitment.entity.JobPosting.Status;
import com.company.hrm.recruitment.dto.JobPostingRequest;
import com.company.hrm.recruitment.dto.JobPostingResponse;
import com.company.hrm.recruitment.repository.JobPostingRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobPostingServiceImpl implements JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public JobPostingResponse createJobPosting(JobPostingRequest requestDto) {
        Position position = positionRepository.findById(requestDto.getPositionId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Position not found with ID: " + requestDto.getPositionId()));

        Department department = departmentRepository.findById(requestDto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Department not found with ID: " + requestDto.getDepartmentId()));

        Employee createdBy = employeeRepository.findById(requestDto.getCreatedById())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Employee not found with ID: " + requestDto.getCreatedById()));

        JobPosting jobPosting = requestDto.toEntity(position, department, createdBy);
        JobPosting savedJobPosting = jobPostingRepository.save(jobPosting);

        return JobPostingResponse.fromEntity(savedJobPosting);
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostingResponse getJobPostingById(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobPosting not found with ID: " + id));
        return JobPostingResponse.fromEntity(jobPosting);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingResponse> getAllJobPostings() {
        return jobPostingRepository.findAll().stream()
                .map(JobPostingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingResponse> getJobPostingsByDepartment(Long departmentId) {
        return jobPostingRepository.findByDepartmentId(departmentId).stream()
                .map(JobPostingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPostingResponse> getJobPostingsByStatus(Status status) {
        return jobPostingRepository.findByStatus(status).stream()
                .map(JobPostingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public JobPostingResponse updateJobPostingStatus(Long id, Status status) {
        JobPosting existingJobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobPosting not found with ID: " + id));

        existingJobPosting.setStatus(status);
        JobPosting updatedJobPosting = jobPostingRepository.save(existingJobPosting);
        return JobPostingResponse.fromEntity(updatedJobPosting);
    }

    @Override
    public JobPostingResponse updateJobPosting(Long id, JobPostingRequest requestDto) {
        JobPosting existingJobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobPosting not found with ID: " + id));

        Position position = positionRepository.findById(requestDto.getPositionId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Position not found with ID: " + requestDto.getPositionId()));

        Department department = departmentRepository.findById(requestDto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Department not found with ID: " + requestDto.getDepartmentId()));

        Employee createdBy = employeeRepository.findById(requestDto.getCreatedById())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Employee not found with ID: " + requestDto.getCreatedById()));

        existingJobPosting.setPosition(position);
        existingJobPosting.setDepartment(department);
        existingJobPosting.setTitle(requestDto.getTitle());
        existingJobPosting.setDescription(requestDto.getDescription());
        existingJobPosting.setRequirements(requestDto.getRequirements());
        existingJobPosting.setEmploymentType(requestDto.getEmploymentType());
        existingJobPosting.setNumberOfOpenings(requestDto.getNumberOfOpenings());
        if (requestDto.getPostedDate() != null) {
            existingJobPosting.setPostedDate(requestDto.getPostedDate());
        }
        existingJobPosting.setClosingDate(requestDto.getClosingDate());
        existingJobPosting.setStatus(requestDto.getStatus());
        existingJobPosting.setCreatedByEmployee(createdBy);

        JobPosting updatedJobPosting = jobPostingRepository.save(existingJobPosting);
        return JobPostingResponse.fromEntity(updatedJobPosting);
    }

    @Override
    public void deleteJobPosting(Long id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new EntityNotFoundException("JobPosting not found with ID: " + id);
        }
        jobPostingRepository.deleteById(id);
    }
}