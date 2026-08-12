"use client";

import Link from "next/link";
import styled from "styled-components";
import type { Customer } from "@/features/crm/types/customer";
import { theme } from "@/styles/theme";

const statusTone: Record<string, { color: string; bg: string }> = {
  ACTIVE: { color: "#16A34A", bg: "#F0FDF4" },
  INACTIVE: { color: "#64748B", bg: "#F1F5F9" },
  SUSPENDED: { color: "#C8102E", bg: "#FFF1F3" },
};

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <Empty>
        No customers yet.{" "}
        <Link href="/crm/customers/new">Create the first customer</Link>.
      </Empty>
    );
  }

  return (
    <Wrap>
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Organization</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const tone = statusTone[c.status] ?? statusTone.INACTIVE;
            return (
              <tr key={c.id}>
                <td>
                  <RowLink href={`/crm/customers/${c.id}`}>
                    {c.customerNumber}
                  </RowLink>
                </td>
                <td>{c.companyName || "—"}</td>
                <td>{c.contactName || "—"}</td>
                <td>{c.email}</td>
                <td>{c.customerType}</td>
                <td>
                  <Badge style={{ color: tone.color, background: tone.bg }}>
                    {c.status}
                  </Badge>
                </td>
                <td>{c.city || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Wrap>
  );
}

const Wrap = styled.div`
  background: #fff;
  border: 1px solid #e8ebf1;
  border-radius: 12px;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    text-align: left;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #eef1f6;
    font-size: 0.9rem;
  }

  th {
    background: #f8f9fc;
    color: #64748b;
    font-size: 0.78rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  tbody tr:hover {
    background: #fafbfe;
  }
`;

const RowLink = styled(Link)`
  color: ${theme.blue};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
`;

const Empty = styled.p`
  background: #fff;
  border: 1px dashed #d5dae6;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #64748b;

  a {
    color: ${theme.blue};
    font-weight: 600;
  }
`;
