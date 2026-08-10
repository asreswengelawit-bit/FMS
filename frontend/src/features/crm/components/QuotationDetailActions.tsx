"use client";

import { useTransition } from "react";
import {
  acceptQuotationAction,
  sendQuotationAction,
} from "@/features/crm/actions/quotations";
import { Button } from "@/features/shared/components/ui/button";
import type { Quotation } from "@/features/crm/types/quotation";

export default function QuotationDetailActions({
  quotation,
}: {
  quotation: Quotation;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {quotation.status === "DRAFT" ? (
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await sendQuotationAction(quotation.id);
            })
          }
        >
          Mark as sent
        </Button>
      ) : null}
      {quotation.status === "DRAFT" || quotation.status === "SENT" ? (
        <Button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await acceptQuotationAction(quotation.id);
            })
          }
        >
          Accept → sales order
        </Button>
      ) : null}
    </div>
  );
}
