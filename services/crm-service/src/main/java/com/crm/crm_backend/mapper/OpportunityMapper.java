package com.crm.crm_backend.mapper;


import com.crm.crm_backend.dto.request.OpportunityCreateDTO;
import com.crm.crm_backend.dto.request.OpportunityUpdateDTO;
import com.crm.crm_backend.dto.response.OpportunityResponseDTO;
import com.crm.crm_backend.model.entity.Opportunity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface OpportunityMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "opportunityNumber", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "stage", ignore = true)
    @Mapping(target = "actualCloseDate", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Opportunity toEntity(OpportunityCreateDTO dto);

    @Mapping(target = "leadId", source = "lead.id")
    @Mapping(target = "customerId", source = "customer.id")
    OpportunityResponseDTO toResponseDTO(Opportunity entity);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "opportunityNumber", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(
            OpportunityUpdateDTO dto,
            @MappingTarget Opportunity entity
    );
}
