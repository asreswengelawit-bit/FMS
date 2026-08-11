package com.crm.crm_backend.service.workflow;

import com.crm.crm_backend.model.enums.CampaignStatus;
import com.crm.crm_backend.model.enums.LeadStatus;
import com.crm.crm_backend.model.enums.OrderStatus;
import com.crm.crm_backend.model.enums.QuotationStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DomainStatusGuardTest {

    @Test
    void leadHappyPath_newToQualifiedToConverted() {
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertLeadTransition(LeadStatus.NEW, LeadStatus.QUALIFIED));
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertLeadTransition(LeadStatus.QUALIFIED, LeadStatus.CONVERTED));
    }

    @Test
    void leadBlocksConvertedToAnything() {
        assertThrows(IllegalStateException.class, () ->
                DomainStatusGuard.assertLeadTransition(LeadStatus.CONVERTED, LeadStatus.NEW));
    }

    @Test
    void quotationAcceptFromDraftAndSent() {
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertQuotationTransition(QuotationStatus.DRAFT, QuotationStatus.ACCEPTED));
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertQuotationTransition(QuotationStatus.SENT, QuotationStatus.ACCEPTED));
    }

    @Test
    void quotationBlocksAcceptFromRejected() {
        assertThrows(IllegalStateException.class, () ->
                DomainStatusGuard.assertQuotationTransition(QuotationStatus.REJECTED, QuotationStatus.ACCEPTED));
    }

    @Test
    void orderConfirmDraftToApproved() {
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertOrderTransition(OrderStatus.DRAFT, OrderStatus.APPROVED));
    }

    @Test
    void campaignActivateCompleteCancel() {
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertCampaignTransition(CampaignStatus.PLANNED, CampaignStatus.ACTIVE));
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertCampaignTransition(CampaignStatus.ACTIVE, CampaignStatus.COMPLETED));
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertCampaignTransition(CampaignStatus.ACTIVE, CampaignStatus.CANCELLED));
        assertThrows(IllegalStateException.class, () ->
                DomainStatusGuard.assertCampaignTransition(CampaignStatus.COMPLETED, CampaignStatus.ACTIVE));
    }

    @Test
    void sameStatusIsNoOp() {
        assertDoesNotThrow(() ->
                DomainStatusGuard.assertLeadTransition(LeadStatus.NEW, LeadStatus.NEW));
    }
}
