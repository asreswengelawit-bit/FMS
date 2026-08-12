package com.crm.crm_backend.validator;

import com.crm.crm_backend.model.entity.Invoice;
import com.crm.crm_backend.model.entity.SalesOrder;
import com.crm.crm_backend.model.enums.OrderStatus;
import org.springframework.stereotype.Component;

@Component
public class InvoiceValidator {

    public void validateCanCreateFromOrder(SalesOrder order) {
        if (order == null) {
            throw new IllegalStateException("Sales order is required to create an invoice");
        }
        if (order.getStatus() != OrderStatus.APPROVED
                && order.getStatus() != OrderStatus.PROCESSING
                && order.getStatus() != OrderStatus.COMPLETED) {
            throw new IllegalStateException(
                    "Invoice can only be created from an APPROVED (or later) sales order. Current status: "
                            + order.getStatus());
        }
    }

    public void validateNotCancelled(Invoice invoice) {
        if (invoice.getStatus() != null
                && "CANCELLED".equals(invoice.getStatus().name())) {
            throw new IllegalStateException("Cannot modify a cancelled invoice");
        }
    }
}
