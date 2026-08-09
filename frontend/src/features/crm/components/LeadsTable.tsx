"use client";

import Link from "next/link";
import { useTransition } from "react";
import styled from "styled-components";
import {
  convertLeadAction,
  qualifyLeadAction,
} from "@/features/crm/actions/leads";
import LeadStatusBadge from "@/features/crm/components/LeadStatusBadge";
import {
  leadDisplayId,
  leadFullName,
  type Lead,
} from "@/features/crm/types/lead";
import { theme } from "@/styles/theme";

function initials(company: string | null, name: string): string {
  const base = (company || name).trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase() || "LD";
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [pending, start] = useTransition();

  if (leads.length === 0) {
    return (
      <Empty>
        No leads yet. <Link href="/crm/leads/new">Create the first lead</Link>.
      </Empty>
    );
  }

  return (
    <Panel>
      <Head>
        <h4>
          Lead Registry <span>({leads.length})</span>
        </h4>
      </Head>
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Organization</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Score</th>
              <th>Stage</th>
              <th>Date</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const name = leadFullName(lead);
              const canConvert =
                lead.status !== "CONVERTED" &&
                lead.status !== "LOST" &&
                lead.status !== "UNQUALIFIED";
              return (
                <tr key={lead.id}>
                  <td>
                    <IdLink href={`/crm/leads/${lead.id}`}>
                      {leadDisplayId(lead.id)}
                    </IdLink>
                  </td>
                  <td>
                    <Org>
                      <Avatar>{initials(lead.company, name)}</Avatar>
                      <div>
                        <strong>{lead.company || "—"}</strong>
                      </div>
                    </Org>
                  </td>
                  <td>
                    <div>{name}</div>
                    <Muted>{lead.phone || lead.email || "—"}</Muted>
                  </td>
                  <td>{lead.source || lead.sourceDetails || "—"}</td>
                  <td>{lead.leadScore ?? 0}</td>
                  <td>
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toISOString().slice(0, 10)
                      : "—"}
                  </td>
                  <td>{lead.assignedTo || "—"}</td>
                  <td>
                    <Actions>
                      {lead.status === "NEW" || lead.status === "CONTACTED" ? (
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
                      ) : null}
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
                          Convert
                        </Primary>
                      ) : (
                        <Muted>Done</Muted>
                      )}
                    </Actions>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
    </Panel>
  );
}

const Panel = styled.div`
  background: #fff;
  border: 1px solid #e8ebf1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
`;

const Head = styled.div`
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eef1f6;

  h4 {
    margin: 0;
    color: ${theme.navy};
    font-size: 0.95rem;
  }
  span {
    color: #94a3b8;
    font-weight: 600;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #eef1f6;
    font-size: 0.88rem;
    vertical-align: middle;
  }
  th {
    background: #f8f9fc;
    color: #64748b;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  tbody tr:hover {
    background: #fafbfe;
  }
`;

const IdLink = styled(Link)`
  color: ${theme.red2};
  font-weight: 700;
`;

const Org = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  strong {
    color: ${theme.navy};
    font-weight: 700;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #eef2ff;
  color: ${theme.blue};
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 800;
  flex: none;
`;

const Muted = styled.div`
  color: #94a3b8;
  font-size: 0.8rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
`;

const Primary = styled.button`
  border: none;
  background: ${theme.red2};
  color: #fff;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const Ghost = styled.button`
  border: 1px solid #e2e6ee;
  background: #fff;
  color: ${theme.navy};
  font-weight: 700;
  font-size: 0.78rem;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
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
