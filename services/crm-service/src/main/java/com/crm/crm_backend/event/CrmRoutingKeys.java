package com.crm.crm_backend.event;

public final class CrmRoutingKeys {

    public static final String SALES_ORDER_CONFIRMED = "sales.order.confirmed";
    public static final String INVOICE_CREATED = "invoice.created";
    public static final String INVOICE_OVERDUE_REMINDER = "invoice.overdue.reminder";
    public static final String PAYMENT_RECEIVED = "payment.received";
    public static final String LEAD_CREATED = "lead.created";
    public static final String LEAD_QUALIFIED = "lead.qualified";
    public static final String LEAD_CONVERTED = "lead.converted";

    private CrmRoutingKeys() {
    }
}
