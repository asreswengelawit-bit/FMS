"use client";

import { useState, useTransition } from "react";
import { createInvoiceFromOrderAction } from "@/features/crm/actions/invoices";
import { confirmSalesOrderAction } from "@/features/crm/actions/sales-orders";
import type { SalesOrder } from "@/features/crm/types/sales-order";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";

export default function SalesOrderDetailActions({
  order,
}: {
  order: SalesOrder;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const canConfirm = order.status === "DRAFT" || order.status === "PENDING";
  const canInvoice =
    order.status === "APPROVED" ||
    order.status === "PROCESSING" ||
    order.status === "COMPLETED";

  if (!canConfirm && !canInvoice) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {error ? <AlertBanner type="warning" message={error} /> : null}
      <div className="flex items-center gap-2">
        {canConfirm ? (
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const result = await confirmSalesOrderAction(order.id);
                if (!result.ok) {
                  setError(result.message || "Confirm failed.");
                }
              })
            }
          >
            {pending ? "Confirming…" : "Confirm order"}
          </Button>
        ) : null}
        {canInvoice ? (
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const result = await createInvoiceFromOrderAction(
                  order.id,
                  order.customerId,
                );
                if (!result.ok) {
                  setError(result.message || "Create invoice failed.");
                }
              })
            }
          >
            Create invoice
          </Button>
        ) : null}
      </div>
    </div>
  );
}
