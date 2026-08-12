"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import {
  createQuotationAction,
  type QuotationActionState,
} from "@/features/crm/actions/quotations";
import type { Customer } from "@/features/crm/types/customer";
import type { Opportunity } from "@/features/crm/types/opportunity";
import { AlertBanner, SectionCard } from "@/features/shared/components";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";

const initial: QuotationActionState = { ok: true };

type Line = {
  key: string;
  itemName: string;
  sku: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export default function QuotationCreateForm({
  customers,
  opportunities,
}: {
  customers: Customer[];
  opportunities: Opportunity[];
}) {
  const [state, formAction, pending] = useActionState(
    createQuotationAction,
    initial,
  );
  const [customerId, setCustomerId] = useState(
    customers[0] ? String(customers[0].id) : "",
  );
  const [lines, setLines] = useState<Line[]>([
    {
      key: "1",
      itemName: "",
      sku: "",
      description: "",
      quantity: "1",
      unitPrice: "0",
    },
  ]);

  const filteredOpps = useMemo(
    () =>
      opportunities.filter(
        (o) => !customerId || String(o.customerId) === customerId,
      ),
    [opportunities, customerId],
  );

  const lineTotal = lines.reduce((sum, line) => {
    const q = Number(line.quantity) || 0;
    const p = Number(line.unitPrice) || 0;
    return sum + q * p;
  }, 0);

  if (customers.length === 0) {
    return (
      <AlertBanner
        type="info"
        message='Create a <a href="/crm/customers/new">customer</a> before adding quotations.'
      />
    );
  }

  if (opportunities.length === 0) {
    return (
      <AlertBanner
        type="warning"
        message='Quotations need an opportunity. Convert a <a href="/crm/leads">qualified lead</a> first, then come back here.'
      />
    );
  }

  return (
    <SectionCard title="New quotation">
      <form action={formAction} className="flex flex-col gap-4">
        {!state.ok && state.message ? (
          <AlertBanner type="warning" message={state.message} />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerId">Customer *</Label>
            <select
              id="customerId"
              name="customerId"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className={selectClass}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName || c.contactName || c.customerNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="opportunityId">Opportunity *</Label>
            <select
              id="opportunityId"
              name="opportunityId"
              required
              defaultValue=""
              className={selectClass}
            >
              <option value="" disabled>
                Select opportunity
              </option>
              {(filteredOpps.length ? filteredOpps : opportunities).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.opportunityName}
                  {o.opportunityNumber ? ` (${o.opportunityNumber})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="issueDate">Issue date *</Label>
            <Input
              id="issueDate"
              name="issueDate"
              type="date"
              required
              defaultValue={todayIso()}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expiryDate">Expiry date *</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="date"
              required
              defaultValue={plusDaysIso(30)}
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={2} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
            Line items
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setLines((prev) => [
                ...prev,
                {
                  key: String(Date.now()),
                  itemName: "",
                  sku: "",
                  description: "",
                  quantity: "1",
                  unitPrice: "0",
                },
              ])
            }
          >
            + Add line
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {lines.map((line, index) => (
            <div
              key={line.key}
              className="grid gap-2 md:grid-cols-[1.4fr_0.7fr_0.55fr_0.7fr_1.2fr_auto]"
            >
              <Input
                name="itemName"
                placeholder="Item name *"
                required
                value={line.itemName}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, itemName: e.target.value } : l,
                    ),
                  )
                }
              />
              <Input
                name="sku"
                placeholder="SKU"
                value={line.sku}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, sku: e.target.value } : l,
                    ),
                  )
                }
              />
              <Input
                name="quantity"
                type="number"
                min="1"
                step="1"
                required
                value={line.quantity}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, quantity: e.target.value } : l,
                    ),
                  )
                }
              />
              <Input
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                required
                value={line.unitPrice}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, unitPrice: e.target.value } : l,
                    ),
                  )
                }
              />
              <Input
                name="description"
                placeholder="Description"
                value={line.description}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, description: e.target.value } : l,
                    ),
                  )
                }
              />
              {lines.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setLines((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </Button>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>

        <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
          Estimated total: ETB {lineTotal.toLocaleString()}
        </p>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link href="/crm/quotations">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Create quotation"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
