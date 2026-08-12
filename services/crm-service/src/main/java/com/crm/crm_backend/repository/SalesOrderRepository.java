package com.crm.crm_backend.repository;


import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    long count();
    Optional<SalesOrder> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    boolean existsByQuotationId(Long quotationId);

    Optional<SalesOrder> findByQuotationId(Long quotationId);

    List<SalesOrder> findByStatus(OrderStatus status);

    List<SalesOrder> findByCustomerId(Long customerId);

    List<SalesOrder> findByOpportunityId(Long opportunityId);
}
