package com.company.hrm.separation.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.company.hrm.department.entity.Department;
import com.company.hrm.employee.entity.Employee;
import com.company.hrm.separation.dto.ClearanceRequest;
import com.company.hrm.separation.dto.ClearanceResponse;
import com.company.hrm.separation.entity.Clearance;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ClearanceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "clearedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Clearance toEntity(ClearanceRequest request);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee", qualifiedByName = "formatEmployeeName")
    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "clearedById", source = "clearedBy.id")
    @Mapping(target = "clearedByName", source = "clearedBy", qualifiedByName = "formatEmployeeName")
    ClearanceResponse toResponse(Clearance clearance);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "clearedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ClearanceRequest request, @MappingTarget Clearance entity);

    @Named("formatEmployeeName")
    default String formatEmployeeName(Employee employee) {
        if (employee == null) {
            return null;
        }
        return employee.getFirstName() + " " + employee.getLastName();
    }
}