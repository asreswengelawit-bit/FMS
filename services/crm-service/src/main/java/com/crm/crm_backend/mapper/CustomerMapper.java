package com.crm.crm_backend.mapper;

// mapper/CustomerMapper.java

import com.crm.crm_backend.dto.request.CustomerCreateDTO;
import com.crm.crm_backend.dto.request.CustomerUpdateDTO;
import com.crm.crm_backend.dto.response.CustomerResponseDTO;
import com.crm.crm_backend.model.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
@Mapper(componentModel = "spring")

public interface CustomerMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customerNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "territory", ignore = true)
    @Mapping(target = "contactName", source = "customerName")
    @Mapping(target = "companyName", source = "organizationName")
    @Mapping(target = "addressLine1", source = "address")
    @Mapping(target = "contactTitle", ignore = true)
    @Mapping(target = "mobile", ignore = true)
    @Mapping(target = "addressLine2", ignore = true)
    @Mapping(target = "state", ignore = true)
    @Mapping(target = "employeeCount", ignore = true)
    @Mapping(target = "annualRevenue", ignore = true)
    @Mapping(target = "creditLimit", ignore = true)
    @Mapping(target = "currentBalance", ignore = true)
    @Mapping(target = "paymentTerms", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "dataClassification", ignore = true)
    @Mapping(target = "securityClearance", ignore = true)
    @Mapping(target = "customerPriority", ignore = true)
    @Mapping(target = "governmentEntity", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "parentCustomer", ignore = true)
    @Mapping(target = "contacts", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    Customer toEntity(CustomerCreateDTO dto);

    @Mapping(target = "territory", ignore = true)
    void updateEntity(CustomerUpdateDTO dto, @MappingTarget Customer customer);

    @Mapping(target = "territoryId", source = "territory.id")
    CustomerResponseDTO toResponseDTO(Customer customer);
}
