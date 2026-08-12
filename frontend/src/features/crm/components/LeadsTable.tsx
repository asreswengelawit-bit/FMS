"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  convertLeadAction,
  qualifyLeadAction,
} from "@/features/crm/actions/leads";
import {
  leadDisplayId,
  leadFullName,
  type Lead,
} from "@/features/crm/types/lead";
import {
  AlertBanner,
  DataTableHead,
  SectionCard,
  StatusBadge,
  UserAvatar,
} from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/features/shared/components/ui/table";

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [pending, start] = useTransition();

  if (leads.length === 0) {
    return (
      <AlertBanner
        type="info"
        message='No leads yet. <a href="/crm/leads/new">Create the first lead</a>.'
      />
    );
  }

  return (
    <SectionCard title="Lead Registry" count={leads.length} noPadding>
      <div className="overflow-x-auto px-5 pb-4 pt-3">
        <Table>
          <DataTableHead
            columns={[
              "Lead ID",
              "Organization",
              "Contact",
              "Source",
              "Score",
              "Stage",
              "Date",
              "Assigned To",
              "Actions",
            ]}
          />
          <TableBody>
            {leads.map((lead) => {
              const name = leadFullName(lead);
              const canConvert =
                lead.status !== "CONVERTED" &&
                lead.status !== "LOST" &&
                lead.status !== "UNQUALIFIED";
              return (
                <TableRow key={lead.id} className="hover:bg-slate-50">
                  <TableCell>
                    <Link
                      href={`/crm/leads/${lead.id}`}
                      className="text-xs font-bold"
                      style={{ color: "#C8102E" }}
                    >
                      {leadDisplayId(lead.id)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={lead.company || name} size={32} />
                      <span className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
                        {lead.company || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{name}</div>
                    <div className="text-xs text-muted-foreground">
                      {lead.phone || lead.email || "—"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {lead.source || lead.sourceDetails || "—"}
                  </TableCell>
                  <TableCell className="text-sm">{lead.leadScore ?? 0}</TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toISOString().slice(0, 10)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {lead.assignedTo || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {lead.status === "NEW" || lead.status === "CONTACTED" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={pending}
                          onClick={() =>
                            start(async () => {
                              await qualifyLeadAction(lead.id);
                            })
                          }
                        >
                          Qualify
                        </Button>
                      ) : null}
                      {canConvert ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={pending}
                          onClick={() =>
                            start(async () => {
                              await convertLeadAction(lead.id);
                            })
                          }
                        >
                          Convert
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Done</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
