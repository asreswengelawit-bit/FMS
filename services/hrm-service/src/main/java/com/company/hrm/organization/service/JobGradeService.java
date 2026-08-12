package com.company.hrm.organization.service;

import com.company.hrm.organization.dto.JobGradeRequest;
import com.company.hrm.organization.dto.JobGradeResponse;

import java.util.List;

public interface JobGradeService {

    JobGradeResponse createJobGrade(JobGradeRequest requestDto);

    JobGradeResponse getJobGradeById(Long id);

    List<JobGradeResponse> getAllJobGrades();

    JobGradeResponse updateJobGrade(Long id, JobGradeRequest requestDto);

    void deleteJobGrade(Long id);
}