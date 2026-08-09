"use client";

import { useTransition } from "react";
import styled from "styled-components";
import {
  convertLeadAction,
  qualifyLeadAction,
} from "@/features/crm/actions/leads";
import type { Lead } from "@/features/crm/types/lead";
import { theme } from "@/styles/theme";

export default function LeadDetailActions({ lead }: { lead: Lead }) {
  const [pending, start] = useTransition();
  const canConvert =
    lead.status !== "CONVERTED" &&
    lead.status !== "LOST" &&
    lead.status !== "UNQUALIFIED";

  return (
    <Wrap>
      {(lead.status === "NEW" || lead.status === "CONTACTED") && (
        <Ghost
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await qualifyLeadAction(lead.id);
            })
          }
        >
          Qualify
        </Ghost>
      )}
      {canConvert ? (
        <Primary
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await convertLeadAction(lead.id);
            })
          }
        >
          Convert to customer
        </Primary>
      ) : null}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Primary = styled.button`
  border: none;
  background: linear-gradient(180deg, ${theme.red2}, ${theme.red});
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;

const Ghost = styled.button`
  border: 1px solid #e2e6ee;
  background: #fff;
  color: ${theme.navy};
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;
