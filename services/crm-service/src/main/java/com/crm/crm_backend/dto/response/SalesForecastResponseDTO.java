package com.crm.crm_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalesForecastResponseDTO {

    private BigDecimal currentRevenue;
    private BigDecimal projectedRevenue;
    private BigDecimal weightedPipeline;
    private BigDecimal openInvoiceBalance;

    private long totalLeads;
    private long convertedLeads;
    private double leadConversionRate;

    private long totalOpportunities;
    private long openOpportunities;
    private long wonOpportunities;
    private double opportunityWinRate;

    private long totalSalesOrders;

    private long totalInvoices;
    private long overdueInvoices;
    private long totalPayments;

    private long totalCampaigns;
    private long activeCampaigns;
}
