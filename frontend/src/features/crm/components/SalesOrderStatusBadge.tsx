"use client";

import styled from "styled-components";
import type { OrderStatus } from "@/features/crm/types/sales-order";

const map: Record<OrderStatus, { bg: string; fg: string }> = {
  DRAFT: { bg: "#f1f5f9", fg: "#475569" },
  PENDING: { bg: "#fff4e0", fg: "#b45309" },
  APPROVED: { bg: "#e8f8ee", fg: "#15803d" },
  PROCESSING: { bg: "#e8efff", fg: "#1d4ed8" },
  COMPLETED: { bg: "#ecfdf5", fg: "#047857" },
  CANCELLED: { bg: "#fee2e2", fg: "#b91c1c" },
};

export default function SalesOrderStatusBadge({
  status,
}: {
  status: OrderStatus;
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
