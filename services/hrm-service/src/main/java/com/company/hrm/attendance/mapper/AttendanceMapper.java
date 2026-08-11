package com.company.hrm.attendance.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named; // <--- Import Named
import org.mapstruct.ReportingPolicy;

import com.company.hrm.attendance.dto.AttendanceRequest;
import com.company.hrm.attendance.dto.AttendanceResponse;
import com.company.hrm.attendance.entity.Attendance;
import com.company.hrm.employee.entity.Employee;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AttendanceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Attendance toEntity(AttendanceRequest request);

    @Mapping(target = "employee", source = "employee", qualifiedByName = "employeeName")
    AttendanceResponse toResponse(Attendance attendance);

    @Named("employeeName") // <--- Add this annotation so MapStruct can match the qualifier
    default String employeeName(Employee employee) {
        if (employee == null) {
            return null;
        }
        return employee.getFirstName() + " " + employee.getLastName();
    }
}