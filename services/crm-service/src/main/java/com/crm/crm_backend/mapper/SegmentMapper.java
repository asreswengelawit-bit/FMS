package com.crm.crm_backend.mapper;


import com.crm.crm_backend.dto.request.SegmentCreateDTO;
import com.crm.crm_backend.dto.request.SegmentUpdateDTO;
import com.crm.crm_backend.dto.response.SegmentResponseDTO;
import com.crm.crm_backend.model.entity.CustomerSegment;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SegmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "segmentNumber", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    CustomerSegment toEntity(SegmentCreateDTO dto);

    SegmentResponseDTO toResponseDTO(CustomerSegment segment);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "segmentNumber", ignore = true)
    @Mapping(target = "segmentName", ignore = true)
    @Mapping(target = "criteriaType", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(
            SegmentUpdateDTO dto,
            @MappingTarget CustomerSegment segment
    );
}