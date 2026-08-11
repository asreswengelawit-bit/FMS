package com.crm.crm_backend.mapper;


import com.crm.crm_backend.dto.request.CampaignCreateDTO;
import com.crm.crm_backend.dto.request.CampaignUpdateDTO;
import com.crm.crm_backend.dto.response.CampaignResponseDTO;
import com.crm.crm_backend.model.entity.Campaign;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CampaignMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "campaignNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "actualRevenue", ignore = true)
    @Mapping(target = "actualLeads", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Campaign toEntity(CampaignCreateDTO dto);

    CampaignResponseDTO toResponseDTO(Campaign campaign);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "campaignNumber", ignore = true)
    @Mapping(target = "campaignName", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "campaignType", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "budget", ignore = true)
    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "expectedRevenue", ignore = true)
    @Mapping(target = "actualRevenue", ignore = true)
    @Mapping(target = "expectedLeads", ignore = true)
    @Mapping(target = "actualLeads", ignore = true)
    @Mapping(target = "targetAudience", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(
            CampaignUpdateDTO dto,
            @MappingTarget Campaign campaign
    );
}
