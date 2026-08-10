import { listCustomers } from "@/features/crm/api/customers";
import { listLeads } from "@/features/crm/api/leads";
import { listQuotations } from "@/features/crm/api/quotations";
import { listSalesOrders } from "@/features/crm/api/sales-orders";
import type { KpiItem } from "@/features/crm/components/CrmKpiRow";
import type { PipelineStage } from "@/features/crm/components/CrmPipeline";
import type { Lead, LeadStatus } from "@/features/crm/types/lead";

export type CrmOverview = {
  kpis: KpiItem[];
  pipeline: PipelineStage[];
  leads: Lead[];
  leadTotal: number;
  customerTotal: number;
  activeCustomerTotal: number;
  openQuotations: number;
  draftOrders: number;
};

function countByStatus(leads: Lead[], status: LeadStatus): number {
  return leads.filter((l) => l.status === status).length;
}

export async function loadCrmOverview(q?: string): Promise<CrmOverview> {
  let leads: Lead[] = [];
  let leadTotal = 0;
  let customerTotal = 0;
  let activeCustomerTotal = 0;
  let openQuotations = 0;
  let draftOrders = 0;

  try {
    const leadPage = await listLeads({ q, page: 0, size: 100 });
    leads = leadPage.content;
    leadTotal = leadPage.totalElements;
  } catch {
    leads = [];
  }

  try {
    const customerPage = await listCustomers({ page: 0, size: 100 });
    customerTotal = customerPage.totalElements;
    activeCustomerTotal = customerPage.content.filter(
      (c) => c.status === "ACTIVE",
    ).length;
  } catch {
    customerTotal = 0;
  }

  try {
    const quotes = await listQuotations({ page: 0, size: 100 });
    openQuotations = quotes.content.filter(
      (x) => x.status === "DRAFT" || x.status === "SENT",
    ).length;
  } catch {
    openQuotations = 0;
  }

  try {
    const orders = await listSalesOrders({ page: 0, size: 100 });
    draftOrders = orders.content.filter(
      (x) => x.status === "DRAFT" || x.status === "PENDING",
    ).length;
  } catch {
    draftOrders = 0;
  }

  const activeLeads = leads.filter(
    (l) =>
      l.status !== "LOST" &&
      l.status !== "CONVERTED" &&
      l.status !== "UNQUALIFIED",
  ).length;

  const kpis: KpiItem[] = [
    {
      label: "Active Leads",
      value: String(activeLeads),
      hint: `${leadTotal} total in registry`,
      hintTone: "red",
      iconTone: "red",
    },
    {
      label: "Open Quotations",
      value: String(openQuotations),
      hint: "Draft + sent",
      hintTone: "blue",
      iconTone: "blue",
    },
    {
      label: "Draft Orders",
      value: String(draftOrders),
      hint: "Awaiting confirm",
      hintTone: "amber",
      iconTone: "amber",
    },
    {
      label: "Customers",
      value: String(customerTotal),
      hint: `${activeCustomerTotal} active`,
      hintTone: "green",
      iconTone: "green",
    },
    {
      label: "Qualified",
      value: String(countByStatus(leads, "QUALIFIED")),
      hint: "Ready to convert",
      hintTone: "blue",
      iconTone: "violet",
    },
    {
      label: "Converted",
      value: String(countByStatus(leads, "CONVERTED")),
      hint: "Became customers",
      hintTone: "green",
      iconTone: "slate",
    },
  ];

  const pipeline: PipelineStage[] = [
    { key: "NEW", label: "New", count: countByStatus(leads, "NEW"), tone: "slate" },
    {
      key: "CONTACTED",
      label: "Contacted",
      count: countByStatus(leads, "CONTACTED"),
      tone: "blue",
    },
    {
      key: "QUALIFIED",
      label: "Qualified",
      count: countByStatus(leads, "QUALIFIED"),
      tone: "pink",
    },
    {
      key: "UNQUALIFIED",
      label: "Unqualified",
      count: countByStatus(leads, "UNQUALIFIED"),
      tone: "amber",
    },
    {
      key: "CONVERTED",
      label: "Converted",
      count: countByStatus(leads, "CONVERTED"),
      tone: "green",
    },
    { key: "LOST", label: "Lost", count: countByStatus(leads, "LOST"), tone: "red" },
  ];

  return {
    kpis,
    pipeline,
    leads,
    leadTotal,
    customerTotal,
    activeCustomerTotal,
    openQuotations,
    draftOrders,
  };
}
