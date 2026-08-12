"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createLeadAction,
  type LeadActionState,
} from "@/features/crm/actions/leads";
import { AlertBanner, SectionCard } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";

const initial: LeadActionState = { ok: true };

const SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "COLD_CALL",
  "SOCIAL_MEDIA",
  "EVENT",
  "PARTNER",
] as const;

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export default function LeadCreateForm() {
  const [state, formAction, pending] = useActionState(createLeadAction, initial);

  return (
    <SectionCard title="New lead">
      <form action={formAction} className="flex flex-col gap-4">
        {!state.ok && state.message ? (
          <AlertBanner type="warning" message={state.message} />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">First name *</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last name *</Label>
            <Input id="lastName" name="lastName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company">Organization</Label>
            <Input id="company" name="company" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="jobTitle">Job title</Label>
            <Input id="jobTitle" name="jobTitle" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="source">Source</Label>
            <select
              id="source"
              name="source"
              defaultValue="WEBSITE"
              className={selectClass}
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="assignedTo">Assigned to</Label>
            <Input id="assignedTo" name="assignedTo" placeholder="username" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sourceDetails">Source details</Label>
            <Input id="sourceDetails" name="sourceDetails" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link href="/crm/leads">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Create lead"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
