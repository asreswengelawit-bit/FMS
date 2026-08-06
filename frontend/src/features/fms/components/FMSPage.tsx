import { Tabs, TabsContent } from "@/features/shared/components/ui/tabs"
import { Landmark, BookOpen, Calendar, BookMarked, ShoppingCart, Receipt, Banknote, PieChart, BarChart2 } from "lucide-react"
import { KPICard, PageHeader } from "@/features/shared/components"
import { FMSAccounts }           from "./FMSAccounts"
import { FMSPeriods }            from "./FMSPeriods"
import { FMSJournals }           from "./FMSJournals"
import { FMSAccountsPayable }    from "./FMSAccountsPayable"
import { FMSAccountsReceivable } from "./FMSAccountsReceivable"
import { FMSCashBank }           from "./FMSCashBank"
import { FMSBudget }             from "./FMSBudget"
import { FMSReports }            from "./FMSReports"
import { accounts, arInvoices, apInvoices, payments, fmsBudgets } from "./fms.data"

interface FMSPageProps { activePage?: string }

const cashBalance    = accounts.find(a => a.code === "1000")?.balance ?? 0
const arOutstanding  = arInvoices.reduce((s, i) => s + i.outstanding, 0)
const arOverdue      = arInvoices.filter(i => i.status === "Overdue").length
const apOutstanding  = apInvoices.reduce((s, i) => s + i.outstanding, 0)
const apOverdue      = apInvoices.filter(i => i.status === "Overdue").length
const budgetUsed     = fmsBudgets.reduce((s, b) => s + b.actual, 0)
const budgetTotal    = fmsBudgets.reduce((s, b) => s + b.allocated, 0)
const netCashIn      = payments.filter(p => p.type === "Incoming").reduce((s, p) => s + p.amount, 0)

const roleChip = (label: string, color: string) => (
  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: color + "20", color }}>{label}</span>
)

export function FMSPage({ activePage }: FMSPageProps) {
  const activeTab = activePage ?? "accounts"

  return (
    <div className="p-6 space-y-5 h-full overflow-auto" style={{ background: "#F4F6FA" }}>
      <PageHeader
        title="Finance Management System"
        subtitle="Chart of Accounts · Periods · General Ledger · AP · AR · Cash & Bank · Budget · Reports"
      />

      {/* Role legend */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Roles:</span>
        {roleChip("Finance Administrator", "#C8102E")}
        {roleChip("General Accountant", "#2563EB")}
        {roleChip("AP Officer", "#D97706")}
        {roleChip("AR Officer", "#16A34A")}
        {roleChip("Finance Manager", "#7C3AED")}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPICard icon={Landmark}    label="Cash Balance"     value={`ETB ${(cashBalance / 1000000).toFixed(1)}M`} subtext="Account 1000"              color="#16A34A" />
        <KPICard icon={BookOpen}    label="COA Accounts"     value={String(accounts.length)}                      subtext="Active accounts"            color="#0B1E3D" />
        <KPICard icon={Calendar}    label="Open Period"      value="Jul 2025"                                      subtext="FY2025 — Period 7"         color="#2563EB" />
        <KPICard icon={BookMarked}  label="Journals"         value="5"                                            subtext="1 draft · 1 submitted"     color="#4F6FAF" />
        <KPICard icon={ShoppingCart}label="AP Outstanding"   value={`ETB ${(apOutstanding / 1000).toFixed(0)}K`} subtext={`${apOverdue} overdue`}    color={apOverdue > 0 ? "#C8102E" : "#D97706"} />
        <KPICard icon={Receipt}     label="AR Outstanding"   value={`ETB ${(arOutstanding / 1000000).toFixed(1)}M`} subtext={`${arOverdue} overdue`} color={arOverdue > 0 ? "#C8102E" : "#D97706"} />
        <KPICard icon={Banknote}    label="Net Cash In"      value={`ETB ${(netCashIn / 1000000).toFixed(1)}M`}  subtext="This period"                color="#16A34A" />
        <KPICard icon={PieChart}    label="Budget Used"      value={`${Math.round((budgetUsed / budgetTotal) * 100)}%`} subtext={`of ETB ${(budgetTotal / 1000000).toFixed(1)}M`} color="#7C3AED" />
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="accounts"            className="mt-0"><FMSAccounts /></TabsContent>
        <TabsContent value="periods"             className="mt-0"><FMSPeriods /></TabsContent>
        <TabsContent value="journals"            className="mt-0"><FMSJournals /></TabsContent>
        <TabsContent value="accounts-payable"    className="mt-0"><FMSAccountsPayable /></TabsContent>
        <TabsContent value="accounts-receivable" className="mt-0"><FMSAccountsReceivable /></TabsContent>
        <TabsContent value="cash-bank"           className="mt-0"><FMSCashBank /></TabsContent>
        <TabsContent value="budget"              className="mt-0"><FMSBudget /></TabsContent>
        <TabsContent value="reports"             className="mt-0"><FMSReports /></TabsContent>
      </Tabs>
    </div>
  )
}
