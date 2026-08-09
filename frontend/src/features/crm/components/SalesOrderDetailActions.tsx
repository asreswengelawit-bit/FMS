"use client";

import { useState, useTransition } from "react";
import { confirmSalesOrderAction } from "@/features/crm/actions/sales-orders";
import { AlertBanner } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import type { SalesOrder } from "@/features/crm/types/sales-order";

export default function SalesOrderDetailActions({
  order,
}: {
  order: SalesOrder;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const canConfirm = order.status === "DRAFT" || order.status === "PENDING";

  if (!canConfirm) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {error ? <AlertBanner type="warning" message={error} /> : null}
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
    </div>
  );
}
