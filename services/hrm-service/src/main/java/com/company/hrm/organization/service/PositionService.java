package com.company.hrm.organization.service;

import com.company.hrm.department.entity.Department;
import com.company.hrm.organization.entity.JobGrade;
import com.company.hrm.organization.entity.Position;
import com.company.hrm.organization.dto.PositionRequest;
import com.company.hrm.organization.dto.PositionResponse;
import com.company.hrm.organization.mapper.OrganizationMapper;
import com.company.hrm.department.repository.DepartmentRepository;
import com.company.hrm.organization.repository.JobGradeRepository;
import com.company.hrm.organization.repository.PositionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PositionService {

        private final PositionRepository positionRepository;
        private final DepartmentRepository departmentRepository;
        private final JobGradeRepository jobGradeRepository;
        private final OrganizationMapper organizationMapper;

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

                Position position = organizationMapper.toEntity(requestDto);
                position.setDepartment(department);
                position.setJobGrade(jobGrade);
                Position savedPosition = positionRepository.save(position);

                return organizationMapper.toResponse(savedPosition);
        }

        @Transactional(readOnly = true)
        public PositionResponse getPositionById(Long id) {
                Position position = positionRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Position not found with ID: " + id));
                return organizationMapper.toResponse(position);
        }

        @Transactional(readOnly = true)
        public List<PositionResponse> getAllPositions() {
                return positionRepository.findAll().stream()
                                .map(organizationMapper::toResponse)
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<PositionResponse> getPositionsByDepartment(Long departmentId) {
                return positionRepository.findByDepartmentId(departmentId).stream()
                                .map(organizationMapper::toResponse)
                                .toList();
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

                organizationMapper.updatePosition(requestDto, existingPosition);
                existingPosition.setDepartment(department);
                existingPosition.setJobGrade(jobGrade);

                Position updatedPosition = positionRepository.save(existingPosition);
                return organizationMapper.toResponse(updatedPosition);
        }

        public void deletePosition(Long id) {
                if (!positionRepository.existsById(id)) {
                        throw new EntityNotFoundException("Position not found with ID: " + id);
                }
                positionRepository.deleteById(id);
        }
}
