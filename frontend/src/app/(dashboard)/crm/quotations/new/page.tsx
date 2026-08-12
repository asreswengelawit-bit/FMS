import Link from "next/link";
import { listCustomers } from "@/features/crm/api/customers";
import { listOpportunities } from "@/features/crm/api/opportunities";
import CrmModuleHeader from "@/features/crm/components/CrmModuleHeader";
import QuotationCreateForm from "@/features/crm/components/QuotationCreateForm";
import { Button } from "@/features/shared/components/ui/button";

export default async function NewQuotationPage() {
  const [customersPage, opportunitiesPage] = await Promise.all([
    listCustomers({ page: 0, size: 100 }).catch(() => ({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0,
      empty: true,
    })),
    listOpportunities(0, 100).catch(() => ({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0,
      empty: true,
    })),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <CrmModuleHeader section="New Quotation" />
      <Button asChild variant="ghost" className="w-fit px-0">
        <Link href="/crm/quotations">← Back to quotations</Link>
      </Button>
      <QuotationCreateForm
        customers={customersPage.content}
        opportunities={opportunitiesPage.content}
      />
    </div>
  );
}
