import { Tabs, TabsContent } from "@/features/shared/components/ui/tabs"
import { Handshake, Users, FileText, DollarSign, Target, CreditCard, BarChart3 } from "lucide-react"
import { KPICard, PageHeader } from "@/features/shared/components"
import { CRMDashboard }     from "./CRMDashboard"
import { CRMLeads }         from "./CRMLeads"
import { CRMOpportunities } from "./CRMOpportunities"
import { CRMSalesOrders }   from "./CRMSalesOrders"
import { CRMCustomers }     from "./CRMCustomers"
import { CRMInvoices }      from "./CRMInvoices"
import { CRMPayments }      from "./CRMPayments"
import { CRMCampaigns }     from "./CRMCampaigns"
import { CRMReports }       from "./CRMReports"
import { CRMSegments }      from "./CRMSegments"
import { CRMAuditLog }      from "./CRMAuditLog"
import { leads, salesOrders, customers, opportunities, invoices } from "./crm.data"

const crmRoleLegend = [
  { role: "SALES MANAGER",      color: "#0B1E3D" },
  { role: "SALES REP",          color: "#C8102E" },
  { role: "ACCOUNT MANAGER",    color: "#2563EB" },
  { role: "MARKETING OFFICER",  color: "#D97706" },
  { role: "AUDITOR",            color: "#94A3B8" },
]

interface CRMPageProps { activePage?: string }

export function CRMPage({ activePage }: CRMPageProps) {
  const activeTab  = activePage ?? "dashboard"
  const pipeline   = opportunities
    .filter(o => o.stage !== "Won" && o.stage !== "Lost")
    .reduce((s, o) => s + o.value, 0)
  const totalRevenue = salesOrders.reduce((s, o) => s + o.amount, 0)
  const overdueInv = invoices.filter(i => i.status === "Overdue").length
  const conversionRate = Math.round(
    (leads.filter(l => l.stage === "Closed Won").length / leads.length) * 100
  )

  return (
    <div className="p-6 space-y-5 h-full overflow-auto" style={{ background: "#F4F6FA" }}>
      <PageHeader
        title="Sales & Customer Relationship Management"
        subtitle="Leads · Opportunities · Orders · Invoices · Payments · Campaigns · Segments · Analytics · Audit"
      />

      {/* Role Legend */}
      <div className="flex flex-wrap gap-2">
        {crmRoleLegend.map(({ role, color }) => (
          <span key={role} className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: color + "18", color }}>
            {role}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KPICard label="Total Leads"      value={String(leads.length)}
          subtext={`${leads.filter(l => l.stage !== "Closed Won" && l.stage !== "Lost").length} active`}
          icon={Handshake} color="#C8102E" />
        <KPICard label="Pipeline"
          value={`ETB ${(pipeline / 1000000).toFixed(1)}M`}
          subtext={`${opportunities.filter(o => o.stage !== "Won" && o.stage !== "Lost").length} open opps`}
          icon={Target} color="#7C3AED" />
        <KPICard label="Win Rate"
          value={`${conversionRate}%`}
          subtext="Lead → Closed Won"
          icon={BarChart3} color="#16A34A" />
        <KPICard label="Sales Orders"     value={String(salesOrders.length)}
          subtext={`${salesOrders.filter(o => o.status === "Pending Approval").length} pending approval`}
          icon={FileText} color="#0B1E3D" />
        <KPICard label="Revenue"
          value={`ETB ${(totalRevenue / 1000000).toFixed(1)}M`}
          subtext="Total orders value" icon={DollarSign} color="#2563EB" />
        <KPICard label="Customers"        value={String(customers.length)}
          subtext={`${customers.filter(c => c.status === "Active").length} active`}
          icon={Users} color="#4F6FAF" />
        <KPICard label="Overdue Invoices" value={String(overdueInv)}
          subtext={`${invoices.filter(i => i.status === "Unpaid").length} unpaid`}
          icon={CreditCard} color={overdueInv > 0 ? "#C8102E" : "#16A34A"} />
      </div>

      {/* CRM Integration note */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: "#E8EDF5" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "#0B1E3D" }}>Module Integrations</p>
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            { label: "MMS (Inventory)", desc: "Stock check & reservation on order", color: "#2563EB" },
            { label: "FMS (Finance)",   desc: "Credit limit check & invoice generation", color: "#7C3AED" },
            { label: "HRM",             desc: "Sales rep assignment & territory", color: "#16A34A" },
            { label: "Audit Service",   desc: "All actions logged for compliance", color: "#94A3B8" },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: color + "10", border: `1px solid ${color}20` }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="font-semibold" style={{ color }}>{label}</span>
              <span className="text-muted-foreground hidden md:inline">— {desc}</span>
            </div>
          ))}
        </div>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="dashboard"     className="mt-0"><CRMDashboard /></TabsContent>
        <TabsContent value="leads"         className="mt-0"><CRMLeads /></TabsContent>
        <TabsContent value="opportunities" className="mt-0"><CRMOpportunities /></TabsContent>
        <TabsContent value="sales-orders"  className="mt-0"><CRMSalesOrders /></TabsContent>
        <TabsContent value="customers"     className="mt-0"><CRMCustomers /></TabsContent>
        <TabsContent value="invoices"      className="mt-0"><CRMInvoices /></TabsContent>
        <TabsContent value="payments"      className="mt-0"><CRMPayments /></TabsContent>
        <TabsContent value="campaigns"     className="mt-0"><CRMCampaigns /></TabsContent>
        <TabsContent value="reports"       className="mt-0"><CRMReports /></TabsContent>
        <TabsContent value="segments"      className="mt-0"><CRMSegments /></TabsContent>
        <TabsContent value="audit-log"     className="mt-0"><CRMAuditLog /></TabsContent>
      </Tabs>
    </div>
  )
}
