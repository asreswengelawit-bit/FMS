"use client";

import styled from "styled-components";
import type { QuotationStatus } from "@/features/crm/types/quotation";

const map: Record<QuotationStatus, { bg: string; fg: string }> = {
  DRAFT: { bg: "#f1f5f9", fg: "#475569" },
  SENT: { bg: "#e8efff", fg: "#1d4ed8" },
  ACCEPTED: { bg: "#e8f8ee", fg: "#15803d" },
  REJECTED: { bg: "#fee2e2", fg: "#b91c1c" },
  EXPIRED: { bg: "#fff4e0", fg: "#b45309" },
  CANCELLED: { bg: "#f1f5f9", fg: "#64748b" },
};

export default function QuotationStatusBadge({
  status,
}: {
  status: QuotationStatus;
}) {
  const tone = map[status] ?? map.DRAFT;
  return <Badge style={{ background: tone.bg, color: tone.fg }}>{status}</Badge>;
}

const Badge = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
`;
