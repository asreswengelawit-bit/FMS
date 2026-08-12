package com.crm.crm_backend.service.analytics;

import com.crm.crm_backend.model.entity.Opportunity;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.repository.InvoiceRepository;
import com.crm.crm_backend.repository.OpportunityRepository;
import com.crm.crm_backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ForecastingService {

    private static final Set<OpportunityStage> OPEN_STAGES = EnumSet.of(
            OpportunityStage.NEW,
            OpportunityStage.NEEDS_ANALYSIS,
            OpportunityStage.QUALIFICATION,
            OpportunityStage.PROPOSAL,
            OpportunityStage.NEGOTIATION
    );

    private final OpportunityRepository opportunityRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final KpiCalculatorService kpiCalculatorService;

    public BigDecimal currentRevenue() {
        return kpiCalculatorService.coalesce(paymentRepository.sumCompletedAmount());
    }

    /**
     * Projected revenue = completed payments + open invoice balances
     * + probability-weighted open opportunity pipeline.
     */
    public BigDecimal projectedRevenue() {
        BigDecimal current = currentRevenue();
        BigDecimal openInvoices = kpiCalculatorService.coalesce(invoiceRepository.sumOpenBalanceAmount());
        BigDecimal weightedPipeline = weightedOpenPipeline();
        return current.add(openInvoices).add(weightedPipeline);
    }

    public BigDecimal weightedOpenPipeline() {
        BigDecimal total = BigDecimal.ZERO;
        for (OpportunityStage stage : OPEN_STAGES) {
            List<Opportunity> opportunities = opportunityRepository.findByStage(stage);
            for (Opportunity opportunity : opportunities) {
                total = total.add(kpiCalculatorService.weightedAmount(
                        opportunity.getExpectedRevenue(),
                        opportunity.getProbability()));
            }
        }
        return total;
    }

    public long countOpenOpportunities() {
        long total = 0;
        for (OpportunityStage stage : OPEN_STAGES) {
            total += opportunityRepository.countByStage(stage);
        }
        return total;
    }
}
