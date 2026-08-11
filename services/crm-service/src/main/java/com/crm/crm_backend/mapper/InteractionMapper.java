package com.crm.crm_backend.mapper;


import com.crm.crm_backend.dto.request.InteractionCreateDTO;
import com.crm.crm_backend.dto.request.InteractionUpdateDTO;
import com.crm.crm_backend.dto.response.InteractionResponseDTO;
import com.crm.crm_backend.model.entity.Interaction;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InteractionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "interactionNumber", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "opportunity", ignore = true)
    @Mapping(target = "completed", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Interaction toEntity(InteractionCreateDTO dto);

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "leadId", source = "lead.id")
    @Mapping(target = "opportunityId", source = "opportunity.id")
    InteractionResponseDTO toResponseDTO(Interaction interaction);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "interactionNumber", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "lead", ignore = true)
    @Mapping(target = "opportunity", ignore = true)
    @Mapping(target = "interactionType", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(
            InteractionUpdateDTO dto,
            @MappingTarget Interaction interaction
    );
}