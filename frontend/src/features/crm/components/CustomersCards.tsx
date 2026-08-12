"use client";

import Link from "next/link";
import type { Customer } from "@/features/crm/types/customer";
import {
  AlertBanner,
  StatusBadge,
  UserAvatar,
} from "@/features/shared/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { Progress } from "@/features/shared/components/ui/progress";

function money(n: number | null | undefined): string {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return Number(n).toLocaleString();
}

export default function CustomersCards({
  customers,
}: {
  customers: Customer[];
}) {
  if (customers.length === 0) {
    return (
      <AlertBanner
        type="info"
        message='No customers yet. <a href="/crm/customers/new">Add the first customer</a>.'
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {customers.map((c) => {
        const title = c.companyName || c.contactName || c.customerNumber;
        const credit = Number(c.creditLimit ?? 0);
        const outstanding = Number(c.currentBalance ?? 0);
        const usage =
          credit > 0
            ? Math.min(100, Math.round((outstanding / credit) * 100))
            : 0;

        return (
          <Link key={c.id} href={`/crm/customers/${c.id}`} className="block">
            <Card className="h-full shadow-sm transition-colors hover:border-primary/30">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
                <div className="flex min-w-0 items-start gap-3">
                  <UserAvatar name={title} size={42} />
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base font-extrabold">
                      {title}
                    </CardTitle>
                    <CardDescription>
                      {c.customerType}
                      {c.city ? ` · ${c.city}` : ""}
                    </CardDescription>
                    <p
                      className="mt-1 text-xs font-bold"
                      style={{ color: "#C8102E" }}
                    >
                      {c.customerNumber}
                    </p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                      Contact
                    </p>
                    <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
                      {c.contactName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                      Credit Limit
                    </p>
                    <p className="text-sm font-bold" style={{ color: "#0B1E3D" }}>
                      {money(credit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                      Outstanding
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: outstanding > 0 ? "#C8102E" : "#0B1E3D",
                      }}
                    >
                      {outstanding > 0 ? money(outstanding) : "Clear"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Progress value={usage} />
                  <p className="text-xs text-muted-foreground">
                    {usage}% credit used
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {c.phone || c.email}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
