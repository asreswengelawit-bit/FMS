"use client";

import Link from "next/link";
import styled from "styled-components";
import type { Customer } from "@/features/crm/types/customer";
import { theme } from "@/styles/theme";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "CU";
}

function money(n: number | null | undefined): string {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString();
}

export default function CustomersCards({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <Empty>
        No customers yet.{" "}
        <Link href="/crm/customers/new">Add the first customer</Link>.
      </Empty>
    );
  }

  return (
    <Grid>
      {customers.map((c) => {
        const title = c.companyName || c.contactName || c.customerNumber;
        const credit = Number(c.creditLimit ?? 0);
        const outstanding = Number(c.currentBalance ?? 0);
        const usage =
          credit > 0 ? Math.min(100, Math.round((outstanding / credit) * 100)) : 0;
        return (
          <Card key={c.id} href={`/crm/customers/${c.id}`}>
            <CardTop>
              <Left>
                <Avatar>{initials(title)}</Avatar>
                <div>
                  <Name>{title}</Name>
                  <Meta>
                    {c.customerType}
                    {c.city ? ` · ${c.city}` : ""}
                  </Meta>
                  <Code>{c.customerNumber}</Code>
                </div>
              </Left>
              <Status $active={c.status === "ACTIVE"}>{c.status}</Status>
            </CardTop>

            <Stats>
              <div>
                <Label>Contact</Label>
                <Val>{c.contactName || "—"}</Val>
              </div>
              <div>
                <Label>Credit Limit</Label>
                <Val>{money(credit)}</Val>
              </div>
              <div>
                <Label>Outstanding</Label>
                <Val $danger={outstanding > 0}>
                  {outstanding > 0 ? money(outstanding) : "Clear"}
                </Val>
              </div>
            </Stats>

            <BarTrack>
              <BarFill style={{ width: `${usage}%` }} />
            </BarTrack>
            <Usage>{usage}% credit used</Usage>
            <Phone>{c.phone || c.email}</Phone>
          </Card>
        );
      })}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  background: #fff;
  border: 1px solid #e8ebf1;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  display: block;

  &:hover {
    border-color: #d7dbe7;
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Left = styled.div`
  display: flex;
  gap: 0.75rem;
  min-width: 0;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #eef2ff;
  color: ${theme.blue};
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.8rem;
  flex: none;
`;

const Name = styled.div`
  color: ${theme.navy};
  font-weight: 800;
  font-size: 0.98rem;
`;

const Meta = styled.div`
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 0.1rem;
`;

const Code = styled.div`
  color: ${theme.red2};
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 0.15rem;
`;

const Status = styled.span<{ $active?: boolean }>`
  align-self: flex-start;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${(p) => (p.$active ? "#15803d" : "#64748b")};
  background: ${(p) => (p.$active ? "#e8f8ee" : "#f1f5f9")};
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.9rem;
`;

const Label = styled.div`
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const Val = styled.div<{ $danger?: boolean }>`
  color: ${(p) => (p.$danger ? theme.red2 : theme.navy)};
  font-weight: 700;
  font-size: 0.9rem;
  margin-top: 0.15rem;
`;

const BarTrack = styled.div`
  margin-top: 0.85rem;
  height: 6px;
  background: #eef2f7;
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: ${theme.red2};
  border-radius: 999px;
`;

const Usage = styled.div`
  margin-top: 0.35rem;
  color: #94a3b8;
  font-size: 0.75rem;
`;

const Phone = styled.div`
  margin-top: 0.55rem;
  color: #475569;
  font-size: 0.82rem;
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
