package com.crm.crm_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardKpiResponseDTO {

    private long totalCustomers;
    private long activeCustomers;

    private long totalLeads;
    private long newLeads;
    private long qualifiedLeads;
    private long convertedLeads;

    private long totalOpportunities;
    private long openOpportunities;
    private long wonOpportunities;
    private long lostOpportunities;
    private BigDecimal pipelineValue;

    private long totalSalesOrders;

    private long totalInvoices;
    private long overdueInvoices;
    private BigDecimal openInvoiceBalance;
    private long totalPayments;

    private BigDecimal totalRevenue;
    private BigDecimal projectedRevenue;

    private long totalCampaigns;
    private long activeCampaigns;
}
