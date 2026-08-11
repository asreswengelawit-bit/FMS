package com.crm.crm_backend.service.analytics;

import com.crm.crm_backend.dto.response.ReportResponseDTO;
import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.model.enums.CustomerStatus;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.model.enums.LeadStatus;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.repository.*;
import com.crm.crm_backend.util.export.CsvGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final OpportunityRepository opportunityRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final CampaignRepository campaignRepository;
    private final ForecastingService forecastingService;
    private final KpiCalculatorService kpiCalculatorService;
    private final CsvGenerator csvGenerator;

    public ReportResponseDTO generateReport() {

        ReportResponseDTO dto = new ReportResponseDTO();

        dto.setTotalCustomers(customerRepository.countByDeletedFalse());
        dto.setActiveCustomers(
                customerRepository.countByStatusAndDeletedFalse(CustomerStatus.ACTIVE));

        dto.setTotalLeads(leadRepository.count());
        dto.setQualifiedLeads(leadRepository.countByStatus(LeadStatus.QUALIFIED));
        dto.setConvertedLeads(leadRepository.countByStatus(LeadStatus.CONVERTED));
        dto.setLeadConversionRate(kpiCalculatorService.rate(
                dto.getConvertedLeads(), dto.getTotalLeads()));

        dto.setTotalOpportunities(opportunityRepository.count());
        dto.setWonOpportunities(opportunityRepository.countByStage(OpportunityStage.CLOSED_WON));
        dto.setLostOpportunities(opportunityRepository.countByStage(OpportunityStage.CLOSED_LOST));
        dto.setOpenOpportunities(forecastingService.countOpenOpportunities());
        dto.setPipelineValue(forecastingService.weightedOpenPipeline());
        dto.setOpportunityWinRate(kpiCalculatorService.rate(
                dto.getWonOpportunities(), dto.getTotalOpportunities()));

        dto.setTotalSalesOrders(salesOrderRepository.count());

        dto.setTotalInvoices(invoiceRepository.count());
        dto.setPaidInvoices(invoiceRepository.countByStatus(InvoiceStatus.PAID));
        dto.setOverdueInvoices(invoiceRepository.countByStatus(InvoiceStatus.OVERDUE));
        dto.setOpenInvoiceBalance(kpiCalculatorService.coalesce(invoiceRepository.sumOpenBalanceAmount()));

        dto.setTotalPayments(paymentRepository.count());
        dto.setTotalRevenue(forecastingService.currentRevenue());
        dto.setProjectedRevenue(forecastingService.projectedRevenue());

        dto.setTotalCampaigns(campaignRepository.count());
        dto.setActiveCampaigns(campaignRepository.countByStatus(CampaignStatus.ACTIVE));

        return dto;
    }

    /**
     * Pipeline / revenue CSV: KPI summary from {@link #generateReport()} plus forecasting fields.
     */
    public String exportReportCsv() {
        ReportResponseDTO report = generateReport();

        List<String> headers = List.of(
                "metric",
                "value"
        );

        List<List<String>> rows = List.of(
                List.of("totalCustomers", String.valueOf(report.getTotalCustomers())),
                List.of("activeCustomers", String.valueOf(report.getActiveCustomers())),
                List.of("totalLeads", String.valueOf(report.getTotalLeads())),
                List.of("qualifiedLeads", String.valueOf(report.getQualifiedLeads())),
                List.of("convertedLeads", String.valueOf(report.getConvertedLeads())),
                List.of("leadConversionRate", String.valueOf(report.getLeadConversionRate())),
                List.of("totalOpportunities", String.valueOf(report.getTotalOpportunities())),
                List.of("openOpportunities", String.valueOf(report.getOpenOpportunities())),
                List.of("wonOpportunities", String.valueOf(report.getWonOpportunities())),
                List.of("lostOpportunities", String.valueOf(report.getLostOpportunities())),
                List.of("opportunityWinRate", String.valueOf(report.getOpportunityWinRate())),
                List.of("pipelineValue", str(report.getPipelineValue())),
                List.of("weightedOpenPipeline", str(forecastingService.weightedOpenPipeline())),
                List.of("totalSalesOrders", String.valueOf(report.getTotalSalesOrders())),
                List.of("totalInvoices", String.valueOf(report.getTotalInvoices())),
                List.of("paidInvoices", String.valueOf(report.getPaidInvoices())),
                List.of("overdueInvoices", String.valueOf(report.getOverdueInvoices())),
                List.of("openInvoiceBalance", str(report.getOpenInvoiceBalance())),
                List.of("totalPayments", String.valueOf(report.getTotalPayments())),
                List.of("totalRevenue", str(report.getTotalRevenue())),
                List.of("currentRevenue", str(forecastingService.currentRevenue())),
                List.of("projectedRevenue", str(report.getProjectedRevenue())),
                List.of("totalCampaigns", String.valueOf(report.getTotalCampaigns())),
                List.of("activeCampaigns", String.valueOf(report.getActiveCampaigns()))
        );

        return csvGenerator.toCsv(headers, rows);
    }

    private static String str(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
