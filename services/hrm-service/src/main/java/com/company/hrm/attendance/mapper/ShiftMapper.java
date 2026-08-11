package com.company.hrm.attendance.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import com.company.hrm.attendance.dto.ShiftRequest;
import com.company.hrm.attendance.dto.ShiftResponse;
import com.company.hrm.attendance.entity.Shift;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ShiftMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Shift toEntity(ShiftRequest request);

    ShiftResponse toResponse(Shift shift);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ShiftRequest request, @MappingTarget Shift entity);
}