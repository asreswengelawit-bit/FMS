"use client";

import styled from "styled-components";
import type { LeadStatus } from "@/features/crm/types/lead";

const map: Record<LeadStatus, { bg: string; fg: string }> = {
  NEW: { bg: "#f1f5f9", fg: "#475569" },
  CONTACTED: { bg: "#e8efff", fg: "#1d4ed8" },
  QUALIFIED: { bg: "#e8efff", fg: "#1d4ed8" },
  UNQUALIFIED: { bg: "#fff4e0", fg: "#b45309" },
  LOST: { bg: "#fee2e2", fg: "#b91c1c" },
  CONVERTED: { bg: "#e8f8ee", fg: "#15803d" },
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const tone = map[status] ?? map.NEW;
  return <Badge style={{ background: tone.bg, color: tone.fg }}>{status}</Badge>;
}

const Badge = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  letter-spacing: 0.02em;
`;
