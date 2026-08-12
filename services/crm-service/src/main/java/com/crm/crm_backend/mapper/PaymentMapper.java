package com.crm.crm_backend.mapper;


import com.crm.crm_backend.dto.request.PaymentCreateDTO;
import com.crm.crm_backend.dto.request.PaymentUpdateDTO;
import com.crm.crm_backend.dto.response.PaymentResponseDTO;
import com.crm.crm_backend.model.entity.Payment;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "paymentNumber", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Payment toEntity(PaymentCreateDTO dto);

    @Mapping(target = "invoiceId", source = "invoice.id")
    @Mapping(target = "customerId", source = "customer.id")
    PaymentResponseDTO toResponseDTO(Payment payment);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "paymentNumber", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "amount", ignore = true)
    @Mapping(target = "paymentDate", ignore = true)
    @Mapping(target = "paymentMethod", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(
            PaymentUpdateDTO dto,
            @MappingTarget Payment payment
    );
}
