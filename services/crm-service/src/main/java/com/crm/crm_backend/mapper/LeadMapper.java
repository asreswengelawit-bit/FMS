package com.crm.crm_backend.mapper;

// mapper/LeadMapper.java
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.BeanMapping;
import com.crm.crm_backend.dto.request.LeadUpdateDTO;
import com.crm.crm_backend.dto.request.LeadCreateDTO;
import com.crm.crm_backend.dto.response.LeadResponseDTO;
import com.crm.crm_backend.model.entity.Lead;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")

public interface LeadMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "leadScore", ignore = true)
    @Mapping(target = "convertedCustomer", ignore = true)
    @Mapping(target = "convertedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "territory", ignore = true)
    Lead toEntity(LeadCreateDTO dto);

    @Mapping(target = "convertedCustomerId", source = "convertedCustomer.id")
    @Mapping(target = "territoryId", source = "territory.id")
    LeadResponseDTO toResponseDTO(Lead entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "territory", ignore = true)
    void updateEntityFromDTO(
            LeadUpdateDTO dto,
            @MappingTarget Lead entity);
}
