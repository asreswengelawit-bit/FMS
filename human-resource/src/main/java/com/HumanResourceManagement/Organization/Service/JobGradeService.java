package com.HumanResourceManagement.Organization.Service;

import com.HumanResourceManagement.Organization.Model.JobGrade;
import com.HumanResourceManagement.Organization.DTO.JobGradeRequest;
import com.HumanResourceManagement.Organization.DTO.JobGradeResponse;
import com.HumanResourceManagement.Organization.Repository.JobGradeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobGradeService {

    private final JobGradeRepository jobGradeRepository;

    public JobGradeResponse createJobGrade(JobGradeRequest requestDto) {
        JobGrade jobGrade = requestDto.toEntity();
        JobGrade savedJobGrade = jobGradeRepository.save(jobGrade);
        return JobGradeResponse.fromEntity(savedJobGrade);
    }

    @Transactional(readOnly = true)
    public JobGradeResponse getJobGradeById(Long id) {
        JobGrade jobGrade = jobGradeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobGrade not found with ID: " + id));
        return JobGradeResponse.fromEntity(jobGrade);
    }

    @Transactional(readOnly = true)
    public List<JobGradeResponse> getAllJobGrades() {
        return jobGradeRepository.findAll().stream()
                .map(JobGradeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public JobGradeResponse updateJobGrade(Long id, JobGradeRequest requestDto) {
        JobGrade existingJobGrade = jobGradeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobGrade not found with ID: " + id));

        existingJobGrade.setName(requestDto.getName());
        existingJobGrade.setLevel(requestDto.getLevel());
        existingJobGrade.setDescription(requestDto.getDescription());
        existingJobGrade.setMinSalary(requestDto.getMinSalary());
        existingJobGrade.setMaxSalary(requestDto.getMaxSalary());

        JobGrade updatedJobGrade = jobGradeRepository.save(existingJobGrade);
        return JobGradeResponse.fromEntity(updatedJobGrade);
    }

    public void deleteJobGrade(Long id) {
        if (!jobGradeRepository.existsById(id)) {
            throw new EntityNotFoundException("JobGrade not found with ID: " + id);
        }
        jobGradeRepository.deleteById(id);
    }
}