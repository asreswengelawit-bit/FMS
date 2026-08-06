import { Tabs, TabsContent } from "@/features/shared/components/ui/tabs"
import { ShoppingCart, FileText, Building2, TrendingUp, Package, FileSearch, ClipboardList } from "lucide-react"
import { KPICard, PageHeader } from "@/features/shared/components"
import { PRMSRequests }      from "./PRMSRequests"
import { PRMSApprovals }     from "./PRMSApprovals"
import { PRMSRfq }           from "./PRMSRfq"
import { PRMSQuotations }    from "./PRMSQuotations"
import { PRMSPurchaseOrders } from "./PRMSPurchaseOrders"
import { PRMSContracts }     from "./PRMSContracts"
import { PRMSGoodsReceipt }  from "./PRMSGoodsReceipt"
import { PRMSSuppliers }     from "./PRMSSuppliers"
import { PRMSBudget }        from "./PRMSBudget"

const workflowSteps = [
  { label: "Purchase Request", desc: "Dept. submits PR",      done: true },
  { label: "HOD Approval",     desc: "Head reviews",          done: true },
  { label: "Finance Review",   desc: "Budget check",          done: true },
  { label: "RFQ & Quotation",  desc: "Competitive sourcing",  done: false, current: true },
  { label: "Purchase Order",   desc: "PO to supplier",        done: false },
  { label: "Goods Receipt",    desc: "Receive & inspect",     done: false },
  { label: "Invoice & Payment", desc: "FMS processes",        done: false },
]

const prmsRoleLegend = [
  { role: "PROCUREMENT OFFICER", color: "#1D4ED8" },
  { role: "APPROVER",            color: "#7C3AED" },
  { role: "WAREHOUSE OFFICER",   color: "#16A34A" },
  { role: "AUDITOR",             color: "#94A3B8" },
]

interface PRMSPageProps { activePage?: string }

export function PRMSPage({ activePage }: PRMSPageProps) {
  const activeTab = activePage ?? "requests"

  return (
    <div className="p-6 space-y-5 h-full overflow-auto" style={{ background: "#F4F6FA" }}>
      <PageHeader
        title="Procurement & Resource Management"
        subtitle="Purchase Requests · Approvals · RFQ · Quotations · PO · Goods Receipt · Suppliers · Contracts · Budget"
      />

      {/* Role Legend */}
      <div className="flex flex-wrap gap-2">
        {prmsRoleLegend.map(({ role, color }) => (
          <span key={role} className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: color + "18", color }}>
            {role}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        <KPICard label="Open Requests"      value="4"   subtext="Awaiting action"         icon={FileText}     color="#C8102E" />
        <KPICard label="Pending Approvals"  value="3"   subtext="HOD + Finance queue"     icon={ClipboardList}color="#7C3AED" />
        <KPICard label="Active RFQs"        value="2"   subtext="Open for quotation"      icon={FileSearch}   color="#2563EB" />
        <KPICard label="POs This Month"     value="6"   subtext="ETB 1.09M total"         icon={ShoppingCart} color="#0B1E3D" />
        <KPICard label="Pending GR"         value="1"   subtext="In transit / processing" icon={Package}      color="#D97706" />
        <KPICard label="Active Suppliers"   value="6"   subtext="4 qualified"             icon={Building2}    color="#16A34A" />
        <KPICard label="Budget Used"        value="71%" subtext="FY2025 YTD"             icon={TrendingUp}   color="#4F6FAF" />
      </div>

      {/* Procurement Workflow Banner */}
      <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #0B1E3D, #162D54)" }}>
        <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#60A5FA" }}>
          End-to-End Procurement Workflow
        </p>
        <div className="flex items-center gap-0 overflow-x-auto">
          {workflowSteps.map((step, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="text-center px-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto mb-1.5"
                  style={{ background: step.done ? "#16A34A" : (step as any).current ? "#D97706" : "rgba(255,255,255,0.15)" }}
                >
                  {step.done ? "✓" : i + 1}
                </div>
                <p className="text-white text-xs font-semibold whitespace-nowrap">{step.label}</p>
                <p className="text-xs whitespace-nowrap hidden lg:block" style={{ color: "#60A5FA" }}>{step.desc}</p>
              </div>
              {i < workflowSteps.length - 1 && (
                <div className="h-px w-5 flex-shrink-0"
                  style={{ background: step.done ? "#16A34A" : "rgba(255,255,255,0.2)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="requests"        className="mt-0"><PRMSRequests /></TabsContent>
        <TabsContent value="approvals"       className="mt-0"><PRMSApprovals /></TabsContent>
        <TabsContent value="rfq"             className="mt-0"><PRMSRfq /></TabsContent>
        <TabsContent value="quotations"      className="mt-0"><PRMSQuotations /></TabsContent>
        <TabsContent value="purchase-orders" className="mt-0"><PRMSPurchaseOrders /></TabsContent>
        <TabsContent value="contracts"       className="mt-0"><PRMSContracts /></TabsContent>
        <TabsContent value="goods-receipt"   className="mt-0"><PRMSGoodsReceipt /></TabsContent>
        <TabsContent value="suppliers"       className="mt-0"><PRMSSuppliers /></TabsContent>
        <TabsContent value="budget"          className="mt-0"><PRMSBudget /></TabsContent>
      </Tabs>
    </div>
  )
}
