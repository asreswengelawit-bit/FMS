package com.crm.crm_backend.service.analytics;

import com.crm.crm_backend.dto.response.SalesForecastResponseDTO;
import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.model.enums.LeadStatus;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final LeadRepository leadRepository;
    private final OpportunityRepository opportunityRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CampaignRepository campaignRepository;
    private final ForecastingService forecastingService;
    private final KpiCalculatorService kpiCalculatorService;

    public SalesForecastResponseDTO getAnalytics() {

        SalesForecastResponseDTO dto = new SalesForecastResponseDTO();

        dto.setCurrentRevenue(forecastingService.currentRevenue());
        dto.setProjectedRevenue(forecastingService.projectedRevenue());
        dto.setWeightedPipeline(forecastingService.weightedOpenPipeline());
        dto.setOpenInvoiceBalance(kpiCalculatorService.coalesce(invoiceRepository.sumOpenBalanceAmount()));

        long totalLeads = leadRepository.count();
        long convertedLeads = leadRepository.countByStatus(LeadStatus.CONVERTED);
        dto.setTotalLeads(totalLeads);
        dto.setConvertedLeads(convertedLeads);
        dto.setLeadConversionRate(kpiCalculatorService.rate(convertedLeads, totalLeads));

        long totalOpp = opportunityRepository.count();
        long wonOpp = opportunityRepository.countByStage(OpportunityStage.CLOSED_WON);
        dto.setTotalOpportunities(totalOpp);
        dto.setWonOpportunities(wonOpp);
        dto.setOpenOpportunities(forecastingService.countOpenOpportunities());
        dto.setOpportunityWinRate(kpiCalculatorService.rate(wonOpp, totalOpp));

        dto.setTotalSalesOrders(salesOrderRepository.count());
        dto.setTotalInvoices(invoiceRepository.count());
        dto.setOverdueInvoices(invoiceRepository.countByStatus(InvoiceStatus.OVERDUE));
        dto.setTotalPayments(paymentRepository.count());

        dto.setTotalCampaigns(campaignRepository.count());
        dto.setActiveCampaigns(campaignRepository.countByStatus(CampaignStatus.ACTIVE));

        return dto;
    }
}
