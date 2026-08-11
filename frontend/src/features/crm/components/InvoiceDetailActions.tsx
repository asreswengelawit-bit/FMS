"use client";

import { useState, useTransition } from "react";
import {
  markInvoicePaidAction,
  sendInvoiceAction,
} from "@/features/crm/actions/invoices";
import type { Invoice } from "@/features/crm/types/invoice";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";

export default function InvoiceDetailActions({
  invoice,
}: {
  invoice: Invoice;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canSend =
    invoice.status === "DRAFT" || invoice.status === "PENDING";
  const canPay =
    invoice.status !== "PAID" &&
    invoice.status !== "CANCELLED" &&
    (invoice.totalAmount ?? 0) > 0;

  if (!canSend && !canPay) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {error ? <AlertBanner type="warning" message={error} /> : null}
      <div className="flex items-center gap-2">
        {canSend ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const result = await sendInvoiceAction(invoice.id);
                if (!result.ok) {
                  setError(result.message || "Send failed.");
                }
              })
            }
          >
            Mark as sent
          </Button>
        ) : null}
        {canPay ? (
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const result = await markInvoicePaidAction(
                  invoice.id,
                  Number(invoice.totalAmount),
                );
                if (!result.ok) {
                  setError(result.message || "Mark paid failed.");
                }
              })
            }
          >
            Mark paid
          </Button>
        ) : null}
      </div>
    </div>
  );
}
