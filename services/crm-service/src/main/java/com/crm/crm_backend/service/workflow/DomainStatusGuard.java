package com.crm.crm_backend.service.workflow;

import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.model.enums.InvoiceStatus;
import com.crm.crm_backend.model.enums.LeadStatus;
import com.crm.crm_backend.model.enums.OpportunityStage;
import com.crm.crm_backend.model.enums.OrderStatus;
import com.crm.crm_backend.model.enums.QuotationStatus;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Central status/stage transition rules for CRM pipeline entities.
 */
public final class DomainStatusGuard {

    private static final Map<LeadStatus, Set<LeadStatus>> LEAD =
            new EnumMap<>(LeadStatus.class);

    private static final Map<OpportunityStage, Set<OpportunityStage>> OPPORTUNITY =
            new EnumMap<>(OpportunityStage.class);

    private static final Map<QuotationStatus, Set<QuotationStatus>> QUOTATION =
            new EnumMap<>(QuotationStatus.class);

    private static final Map<OrderStatus, Set<OrderStatus>> ORDER =
            new EnumMap<>(OrderStatus.class);

    private static final Map<InvoiceStatus, Set<InvoiceStatus>> INVOICE =
            new EnumMap<>(InvoiceStatus.class);

    private static final Map<CampaignStatus, Set<CampaignStatus>> CAMPAIGN =
            new EnumMap<>(CampaignStatus.class);

    static {
        LEAD.put(LeadStatus.NEW, EnumSet.of(
                LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.UNQUALIFIED, LeadStatus.LOST));
        LEAD.put(LeadStatus.CONTACTED, EnumSet.of(
                LeadStatus.QUALIFIED, LeadStatus.UNQUALIFIED, LeadStatus.LOST, LeadStatus.NEW));
        LEAD.put(LeadStatus.QUALIFIED, EnumSet.of(
                LeadStatus.CONVERTED, LeadStatus.UNQUALIFIED, LeadStatus.LOST, LeadStatus.CONTACTED));
        LEAD.put(LeadStatus.UNQUALIFIED, EnumSet.of(
                LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.LOST));
        LEAD.put(LeadStatus.LOST, EnumSet.of(LeadStatus.CONTACTED, LeadStatus.NEW));
        LEAD.put(LeadStatus.CONVERTED, EnumSet.noneOf(LeadStatus.class));

        OPPORTUNITY.put(OpportunityStage.NEW, EnumSet.of(
                OpportunityStage.NEEDS_ANALYSIS, OpportunityStage.QUALIFICATION, OpportunityStage.CLOSED_LOST));
        OPPORTUNITY.put(OpportunityStage.NEEDS_ANALYSIS, EnumSet.of(
                OpportunityStage.QUALIFICATION, OpportunityStage.PROPOSAL, OpportunityStage.CLOSED_LOST));
        OPPORTUNITY.put(OpportunityStage.QUALIFICATION, EnumSet.of(
                OpportunityStage.PROPOSAL, OpportunityStage.NEEDS_ANALYSIS, OpportunityStage.CLOSED_LOST));
        OPPORTUNITY.put(OpportunityStage.PROPOSAL, EnumSet.of(
                OpportunityStage.NEGOTIATION, OpportunityStage.QUALIFICATION, OpportunityStage.CLOSED_LOST));
        OPPORTUNITY.put(OpportunityStage.NEGOTIATION, EnumSet.of(
                OpportunityStage.CLOSED_WON, OpportunityStage.CLOSED_LOST, OpportunityStage.PROPOSAL));
        OPPORTUNITY.put(OpportunityStage.CLOSED_WON, EnumSet.noneOf(OpportunityStage.class));
        OPPORTUNITY.put(OpportunityStage.CLOSED_LOST, EnumSet.noneOf(OpportunityStage.class));

        QUOTATION.put(QuotationStatus.DRAFT, EnumSet.of(
                QuotationStatus.SENT, QuotationStatus.CANCELLED, QuotationStatus.ACCEPTED,
                QuotationStatus.EXPIRED));
        QUOTATION.put(QuotationStatus.SENT, EnumSet.of(
                QuotationStatus.ACCEPTED, QuotationStatus.REJECTED, QuotationStatus.EXPIRED,
                QuotationStatus.CANCELLED, QuotationStatus.DRAFT));
        QUOTATION.put(QuotationStatus.ACCEPTED, EnumSet.noneOf(QuotationStatus.class));
        QUOTATION.put(QuotationStatus.REJECTED, EnumSet.noneOf(QuotationStatus.class));
        QUOTATION.put(QuotationStatus.EXPIRED, EnumSet.noneOf(QuotationStatus.class));
        QUOTATION.put(QuotationStatus.CANCELLED, EnumSet.noneOf(QuotationStatus.class));

        ORDER.put(OrderStatus.DRAFT, EnumSet.of(OrderStatus.PENDING, OrderStatus.APPROVED, OrderStatus.CANCELLED));
        ORDER.put(OrderStatus.PENDING, EnumSet.of(OrderStatus.APPROVED, OrderStatus.DRAFT, OrderStatus.CANCELLED));
        ORDER.put(OrderStatus.APPROVED, EnumSet.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED));
        ORDER.put(OrderStatus.PROCESSING, EnumSet.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED));
        ORDER.put(OrderStatus.COMPLETED, EnumSet.noneOf(OrderStatus.class));
        ORDER.put(OrderStatus.CANCELLED, EnumSet.noneOf(OrderStatus.class));

        INVOICE.put(InvoiceStatus.DRAFT, EnumSet.of(
                InvoiceStatus.PENDING, InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.CANCELLED));
        INVOICE.put(InvoiceStatus.PENDING, EnumSet.of(
                InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.CANCELLED));
        INVOICE.put(InvoiceStatus.SENT, EnumSet.of(
                InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.PENDING, InvoiceStatus.CANCELLED));
        INVOICE.put(InvoiceStatus.OVERDUE, EnumSet.of(InvoiceStatus.PAID, InvoiceStatus.CANCELLED));
        // Allow reopening after payment reversal (CANCELLED / REFUNDED payment)
        INVOICE.put(InvoiceStatus.PAID, EnumSet.of(InvoiceStatus.PENDING));
        INVOICE.put(InvoiceStatus.CANCELLED, EnumSet.noneOf(InvoiceStatus.class));

        CAMPAIGN.put(CampaignStatus.PLANNED, EnumSet.of(
                CampaignStatus.ACTIVE, CampaignStatus.CANCELLED));
        CAMPAIGN.put(CampaignStatus.ACTIVE, EnumSet.of(
                CampaignStatus.COMPLETED, CampaignStatus.CANCELLED));
        CAMPAIGN.put(CampaignStatus.COMPLETED, EnumSet.noneOf(CampaignStatus.class));
        CAMPAIGN.put(CampaignStatus.CANCELLED, EnumSet.noneOf(CampaignStatus.class));
    }

    private DomainStatusGuard() {
    }

    public static void assertLeadTransition(LeadStatus from, LeadStatus to) {
        assertTransition("Lead", from, to, LEAD.getOrDefault(from, Set.of()));
    }

    public static void assertOpportunityTransition(OpportunityStage from, OpportunityStage to) {
        assertTransition("Opportunity", from, to, OPPORTUNITY.getOrDefault(from, Set.of()));
    }

    public static void assertQuotationTransition(QuotationStatus from, QuotationStatus to) {
        assertTransition("Quotation", from, to, QUOTATION.getOrDefault(from, Set.of()));
    }

    public static void assertOrderTransition(OrderStatus from, OrderStatus to) {
        assertTransition("Sales order", from, to, ORDER.getOrDefault(from, Set.of()));
    }

    public static void assertInvoiceTransition(InvoiceStatus from, InvoiceStatus to) {
        assertTransition("Invoice", from, to, INVOICE.getOrDefault(from, Set.of()));
    }

    public static void assertCampaignTransition(CampaignStatus from, CampaignStatus to) {
        assertTransition("Campaign", from, to, CAMPAIGN.getOrDefault(from, Set.of()));
    }

    private static <E extends Enum<E>> void assertTransition(
            String label, E from, E to, Set<E> allowed) {
        if (from == to) {
            return;
        }
        if (from == null || to == null || !allowed.contains(to)) {
            throw new IllegalStateException(
                    label + " cannot transition from " + from + " to " + to);
        }
    }
}
