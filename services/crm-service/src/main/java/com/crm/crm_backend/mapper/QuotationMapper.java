package com.crm.crm_backend.mapper;

import com.crm.crm_backend.dto.request.QuotationCreateDTO;
import com.crm.crm_backend.dto.request.QuotationUpdateDTO;
import com.crm.crm_backend.dto.response.QuotationItemResponseDTO;
import com.crm.crm_backend.dto.response.QuotationResponseDTO;
import com.crm.crm_backend.model.entity.Quotation;
import com.crm.crm_backend.model.entity.QuotationItem;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuotationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quotationNumber", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "opportunity", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Quotation toEntity(QuotationCreateDTO dto);

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "opportunityId", source = "opportunity.id")
    @Mapping(target = "salesOrderId", ignore = true)
    @Mapping(target = "items", source = "items")
    QuotationResponseDTO toResponseDTO(Quotation quotation);

    QuotationItemResponseDTO toItemResponseDTO(QuotationItem item);

    List<QuotationItemResponseDTO> toItemResponseDTOs(List<QuotationItem> items);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "quotationNumber", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "opportunity", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(
            QuotationUpdateDTO dto,
            @MappingTarget Quotation quotation
    );
}
