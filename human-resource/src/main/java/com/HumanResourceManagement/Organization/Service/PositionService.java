package com.HumanResourceManagement.Organization.Service;

import com.HumanResourceManagement.Organization.Model.Department;
import com.HumanResourceManagement.Organization.Model.JobGrade;
import com.HumanResourceManagement.Organization.Model.Position;
import com.HumanResourceManagement.Organization.DTO.PositionRequest;
import com.HumanResourceManagement.Organization.DTO.PositionResponse;
import com.HumanResourceManagement.Organization.Repository.DepartmentRepository;
import com.HumanResourceManagement.Organization.Repository.JobGradeRepository;
import com.HumanResourceManagement.Organization.Repository.PositionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionService {

        private final PositionRepository positionRepository;
        private final DepartmentRepository departmentRepository;
        private final JobGradeRepository jobGradeRepository;

        public PositionResponse createPosition(PositionRequest requestDto) {
                Department department = departmentRepository.findById(requestDto.getDepartmentId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Department not found with ID: " + requestDto.getDepartmentId()));

                JobGrade jobGrade = null;
                if (requestDto.getJobGradeId() != null) {
                        jobGrade = jobGradeRepository.findById(requestDto.getJobGradeId())
                                        .orElseThrow(() -> new EntityNotFoundException(
                                                        "JobGrade not found with ID: " + requestDto.getJobGradeId()));
                }

                Position position = requestDto.toEntity(department, jobGrade);
                Position savedPosition = positionRepository.save(position);

                return PositionResponse.fromEntity(savedPosition);
        }

        @Transactional(readOnly = true)
        public PositionResponse getPositionById(Long id) {
                Position position = positionRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Position not found with ID: " + id));
                return PositionResponse.fromEntity(position);
        }

        @Transactional(readOnly = true)
        public List<PositionResponse> getAllPositions() {
                return positionRepository.findAll().stream()
                                .map(PositionResponse::fromEntity)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<PositionResponse> getPositionsByDepartment(Long departmentId) {
                return positionRepository.findByDepartmentId(departmentId).stream()
                                .map(PositionResponse::fromEntity)
                                .collect(Collectors.toList());
        }

        public PositionResponse updatePosition(Long id, PositionRequest requestDto) {
                Position existingPosition = positionRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Position not found with ID: " + id));

                Department department = departmentRepository.findById(requestDto.getDepartmentId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Department not found with ID: " + requestDto.getDepartmentId()));

                JobGrade jobGrade = null;
                if (requestDto.getJobGradeId() != null) {
                        jobGrade = jobGradeRepository.findById(requestDto.getJobGradeId())
                                        .orElseThrow(() -> new EntityNotFoundException(
                                                        "JobGrade not found with ID: " + requestDto.getJobGradeId()));
                }

                existingPosition.setDepartment(department);
                existingPosition.setJobGrade(jobGrade);
                existingPosition.setTitle(requestDto.getTitle());
                existingPosition.setCode(requestDto.getCode());
                existingPosition.setDescription(requestDto.getDescription());
                existingPosition.setMinSalary(requestDto.getMinSalary());
                existingPosition.setMaxSalary(requestDto.getMaxSalary());
                existingPosition.setStatus(requestDto.getStatus());

                Position updatedPosition = positionRepository.save(existingPosition);
                return PositionResponse.fromEntity(updatedPosition);
        }

        public void deletePosition(Long id) {
                if (!positionRepository.existsById(id)) {
                        throw new EntityNotFoundException("Position not found with ID: " + id);
                }
                positionRepository.deleteById(id);
        }
}