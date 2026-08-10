"use client";

import { useTransition } from "react";
import {
  convertLeadAction,
  qualifyLeadAction,
} from "@/features/crm/actions/leads";
import { Button } from "@/features/shared/components/ui/button";
import type { Lead } from "@/features/crm/types/lead";

export default function LeadDetailActions({ lead }: { lead: Lead }) {
  const [pending, start] = useTransition();
  const canConvert =
    lead.status !== "CONVERTED" &&
    lead.status !== "LOST" &&
    lead.status !== "UNQUALIFIED";

  return (
    <div className="flex items-center gap-2">
      {(lead.status === "NEW" || lead.status === "CONTACTED") && (
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await qualifyLeadAction(lead.id);
            })
          }
        >
          Qualify
        </Button>
      )}
      {canConvert ? (
        <Button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await convertLeadAction(lead.id);
            })
          }
        >
          Convert to customer
        </Button>
      ) : null}
    </div>
  );
}
