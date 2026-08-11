package com.crm.crm_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ReportResponseDTO {

    private long totalCustomers;
    private long activeCustomers;

    private long totalLeads;
    private long qualifiedLeads;
    private long convertedLeads;
    private double leadConversionRate;

    private long totalOpportunities;
    private long openOpportunities;
    private long wonOpportunities;
    private long lostOpportunities;
    private double opportunityWinRate;
    private BigDecimal pipelineValue;

    private long totalSalesOrders;

    private long totalInvoices;
    private long paidInvoices;
    private long overdueInvoices;
    private BigDecimal openInvoiceBalance;
    private long totalPayments;

    private BigDecimal totalRevenue;
    private BigDecimal projectedRevenue;

    private long totalCampaigns;
    private long activeCampaigns;
}
