package com.company.hrm.leave.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.leave.dto.LeaveRequest;
import com.company.hrm.leave.dto.LeaveResponse;
import com.company.hrm.leave.entity.Leave;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeaveMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "status", ignore = true) // Status is typically managed via workflow transitions or defaulted to PENDING
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Leave toEntity(LeaveRequest request);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee", qualifiedByName = "formatEmployeeName")
    LeaveResponse toResponse(Leave leave);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(LeaveRequest request, @MappingTarget Leave entity);

    @Named("formatEmployeeName")
    default String formatEmployeeName(Employee employee) {
        if (employee == null) {
            return null;
        }
        return employee.getFirstName() + " " + employee.getLastName();
    }
}