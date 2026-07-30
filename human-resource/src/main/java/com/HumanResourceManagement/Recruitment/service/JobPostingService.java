package com.HumanResourceManagement.Recruitment.service;

import com.HumanResourceManagement.Employee.Model.Employee;
import com.HumanResourceManagement.Employee.Repository.EmployeeRepository;
// import com.HumanResourceManagement.Employee.repository.EmployeeRepository;
import com.HumanResourceManagement.Organization.Model.Department;
import com.HumanResourceManagement.Organization.Model.Position;
import com.HumanResourceManagement.Organization.Repository.DepartmentRepository;
import com.HumanResourceManagement.Organization.Repository.PositionRepository;
// import com.HumanResourceManagement.Organization.repository.DepartmentRepository;
// import com.HumanResourceManagement.Organization.repository.PositionRepository;
import com.HumanResourceManagement.Recruitment.Model.JobPosting;
import com.HumanResourceManagement.Recruitment.Model.JobPosting.Status;
import com.HumanResourceManagement.Recruitment.dto.JobPostingRequest;
import com.HumanResourceManagement.Recruitment.dto.JobPostingResponse;
import com.HumanResourceManagement.Recruitment.repository.JobPostingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

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

    @Transactional(readOnly = true)
    public JobPostingResponse getJobPostingById(Long id) {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobPosting not found with ID: " + id));
        return JobPostingResponse.fromEntity(jobPosting);
    }

    @Transactional(readOnly = true)
    public List<JobPostingResponse> getAllJobPostings() {
        return jobPostingRepository.findAll().stream()
                .map(JobPostingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobPostingResponse> getJobPostingsByDepartment(Long departmentId) {
        return jobPostingRepository.findByDepartmentId(departmentId).stream()
                .map(JobPostingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobPostingResponse> getJobPostingsByStatus(Status status) {
        return jobPostingRepository.findByStatus(status).stream()
                .map(JobPostingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public JobPostingResponse updateJobPostingStatus(Long id, Status status) {
        JobPosting existingJobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobPosting not found with ID: " + id));

        existingJobPosting.setStatus(status);
        JobPosting updatedJobPosting = jobPostingRepository.save(existingJobPosting);
        return JobPostingResponse.fromEntity(updatedJobPosting);
    }

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
        existingJobPosting.setCreatedBy(createdBy);

        JobPosting updatedJobPosting = jobPostingRepository.save(existingJobPosting);
        return JobPostingResponse.fromEntity(updatedJobPosting);
    }

    public void deleteJobPosting(Long id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new EntityNotFoundException("JobPosting not found with ID: " + id);
        }
        jobPostingRepository.deleteById(id);
    }
}