"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createCustomerAction,
  type CreateCustomerState,
} from "@/features/crm/actions/customers";
import { AlertBanner, SectionCard } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";

const initial: CreateCustomerState = { ok: true };

const CUSTOMER_TYPES = [
  "GOVERNMENT",
  "INDIVIDUAL",
  "PRIVATE",
  "ORGANIZATION",
  "NGO",
  "INTERNATIONAL",
] as const;

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export default function CustomerCreateForm() {
  const [state, formAction, pending] = useActionState(
    createCustomerAction,
    initial,
  );

  return (
    <SectionCard title="New customer">
      <form action={formAction} className="flex flex-col gap-4">
        {!state.ok && state.message ? (
          <AlertBanner type="warning" message={state.message} />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerName">Contact name *</Label>
            <Input id="customerName" name="customerName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organizationName">Organization *</Label>
            <Input id="organizationName" name="organizationName" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerType">Customer type *</Label>
            <select
              id="customerType"
              name="customerType"
              required
              defaultValue="ORGANIZATION"
              className={selectClass}
            >
              {CUSTOMER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" name="phone" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="postalCode">Postal code</Label>
            <Input id="postalCode" name="postalCode" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link href="/crm/customers">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Create customer"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
