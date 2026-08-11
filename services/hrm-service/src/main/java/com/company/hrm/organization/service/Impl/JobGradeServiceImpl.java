package com.company.hrm.organization.service.Impl;

import com.company.hrm.organization.dto.JobGradeRequest;
import com.company.hrm.organization.dto.JobGradeResponse;
import com.company.hrm.organization.entity.JobGrade;
import com.company.hrm.organization.mapper.OrganizationMapper;
import com.company.hrm.organization.repository.JobGradeRepository;
import com.company.hrm.organization.service.JobGradeService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobGradeServiceImpl implements JobGradeService {

    private final JobGradeRepository jobGradeRepository;
    private final OrganizationMapper organizationMapper;

    @Override
    public JobGradeResponse createJobGrade(JobGradeRequest requestDto) {
        JobGrade jobGrade = organizationMapper.toEntity(requestDto);
        JobGrade savedJobGrade = jobGradeRepository.save(jobGrade);
        return organizationMapper.toResponse(savedJobGrade);
    }

    @Override
    @Transactional(readOnly = true)
    public JobGradeResponse getJobGradeById(Long id) {
        JobGrade jobGrade = jobGradeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobGrade not found with ID: " + id));
        return organizationMapper.toResponse(jobGrade);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobGradeResponse> getAllJobGrades() {
        return jobGradeRepository.findAll().stream()
                .map(organizationMapper::toResponse)
                .toList();
    }

    @Override
    public JobGradeResponse updateJobGrade(Long id, JobGradeRequest requestDto) {
        JobGrade existingJobGrade = jobGradeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobGrade not found with ID: " + id));

        organizationMapper.updateJobGrade(requestDto, existingJobGrade);

        JobGrade updatedJobGrade = jobGradeRepository.save(existingJobGrade);
        return organizationMapper.toResponse(updatedJobGrade);
    }

    @Override
    public void deleteJobGrade(Long id) {
        if (!jobGradeRepository.existsById(id)) {
            throw new EntityNotFoundException("JobGrade not found with ID: " + id);
        }
        jobGradeRepository.deleteById(id);
    }
}