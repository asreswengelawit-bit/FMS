import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Warehouse,
  Handshake,
  Landmark,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react"
import { cn } from "@/features/shared/components/ui/utils"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import insaLogo from "../../imports/Logo_of_Ethiopian_INSA.png"

interface SidebarProps {
  activeModule: string
  activePage: string
  setActiveModule: (module: string) => void
  setActivePage: (page: string) => void
  userRole: string
  userName: string
  displayRole: string
  onLogout: () => void
}

interface SubItem {
  id: string
  label: string
  isDivider?: boolean
}

interface ModuleItem {
  id: string
  label: string
  icon: React.ElementType
  roles: string[]
  subItems: SubItem[]
  defaultPage: string
}

const allModules: ModuleItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [],
    subItems: [],
    defaultPage: "overview",
  },
  {
    id: "hrm",
    label: "Human Resources",
    icon: Users,
    roles: ["super_admin", "hr_manager", "auditor"],
    defaultPage: "dashboard",
    subItems: [
      { id: "dashboard",          label: "Dashboard" },
      { id: "employees",          label: "Employees" },
      { id: "departments",        label: "Departments" },
      { id: "positions",          label: "Positions" },
      { id: "attendance",         label: "Attendance" },
      { id: "leave",              label: "Leave" },
      { id: "payroll-support",    label: "Payroll Support" },
      { id: "assignment-history", label: "Assignment History" },
      { id: "reports",            label: "Reports" },
      { id: "audit-log",          label: "Audit Log" },
    ],
  },
  {
    id: "prms",
    label: "Procurement",
    icon: ShoppingCart,
    roles: ["super_admin", "procurement_officer", "approver", "warehouse_officer", "auditor"],
    defaultPage: "requests",
    subItems: [
      { id: "requests",        label: "Purchase Requests" },
      { id: "approvals",       label: "Approvals" },
      { id: "rfq",             label: "RFQ" },
      { id: "quotations",      label: "Quotations" },
      { id: "purchase-orders", label: "Purchase Orders" },
      { id: "contracts",       label: "Contracts" },
      { id: "goods-receipt",   label: "Goods Receipt" },
      { id: "suppliers",       label: "Suppliers" },
      { id: "budget",          label: "Budget" },
    ],
  },
  {
    id: "mms",
    label: "Materials",
    icon: Warehouse,
    roles: ["super_admin", "inventory_manager", "procurement_officer", "auditor"],
    defaultPage: "items",
    subItems: [
      { id: "items",        label: "Item Master" },
      { id: "warehouses",   label: "Warehouses" },
      { id: "stock-levels", label: "Stock Levels" },
      { id: "movements",    label: "Movements" },
      { id: "requisitions", label: "Requisitions" },
    ],
  },
  {
    id: "crm",
    label: "Sales & CRM",
    icon: Handshake,
    roles: ["super_admin", "sales_officer", "sales_manager", "account_manager", "marketing_officer", "auditor"],
    defaultPage: "dashboard",
    subItems: [
      { id: "dashboard",     label: "Dashboard" },
      { id: "leads",         label: "Leads" },
      { id: "opportunities", label: "Opportunities" },
      { id: "sales-orders",  label: "Sales Orders" },
      { id: "customers",     label: "Customers" },
      { id: "invoices",      label: "Invoices" },
      { id: "payments",      label: "Payments" },
      { id: "campaigns",     label: "Campaigns" },
      { id: "reports",       label: "Reports" },
      { id: "segments",      label: "Segments" },
      { id: "audit-log",     label: "Audit Log" },
    ],
  },
  {
    id: "fms",
    label: "Finance",
    icon: Landmark,
    roles: ["super_admin", "finance_administrator", "general_accountant", "ap_officer", "ar_officer", "finance_manager", "auditor"],
    defaultPage: "accounts",
    subItems: [
      { id: "accounts",            label: "Chart of Accounts" },
      { id: "periods",             label: "Accounting Periods" },
      { id: "journals",            label: "General Ledger" },
      { id: "accounts-payable",    label: "Accounts Payable" },
      { id: "accounts-receivable", label: "Accounts Receivable" },
      { id: "cash-bank",           label: "Cash & Bank" },
      { id: "budget",              label: "Budget" },
      { id: "reports",             label: "Reports" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    roles: ["super_admin"],
    subItems: [],
    defaultPage: "overview",
  },
]

const roleColors: Record<string, string> = {
  super_admin:             "#C8102E",
  hr_manager:              "#2563EB",
  procurement_officer:     "#1D4ED8",
  approver:                "#7C3AED",
  warehouse_officer:       "#16A34A",
  inventory_manager:       "#1D4ED8",
  sales_officer:           "#C8102E",
  sales_manager:           "#0B1E3D",
  account_manager:         "#2563EB",
  marketing_officer:       "#D97706",
  finance_administrator:   "#C8102E",
  general_accountant:      "#2563EB",
  ap_officer:              "#D97706",
  ar_officer:              "#16A34A",
  finance_manager:         "#7C3AED",
  finance_officer:         "#2563EB",
  auditor:                 "#94A3B8",
}

export function Sidebar({
  activeModule,
  activePage,
  setActiveModule,
  setActivePage,
  userRole,
  userName,
  displayRole,
  onLogout,
}: SidebarProps) {
  const [expandedModule, setExpandedModule] = useState<string>(activeModule)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  const visibleModules = allModules.filter(
    m => m.id === "dashboard" || m.id === "settings"
      ? (m.id === "settings" ? m.roles.includes(userRole) : true)
      : m.roles.includes(userRole)
  )

  const initials  = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  const roleColor = roleColors[userRole] ?? "#2563EB"

  function handleModuleClick(mod: ModuleItem) {
    // If sidebar is collapsed, clicking a module expands the sidebar first
    if (isCollapsed) {
      setIsCollapsed(false)
      setActiveModule(mod.id)
      setActivePage(mod.defaultPage)
      setExpandedModule(mod.id)
      return
    }

    if (mod.subItems.length === 0) {
      setActiveModule(mod.id)
      setActivePage(mod.defaultPage)
      setExpandedModule(mod.id)
    } else {
      if (expandedModule === mod.id) {
        // Collapse — but keep it active
        setExpandedModule("")
      } else {
        setExpandedModule(mod.id)
        setActiveModule(mod.id)
        setActivePage(mod.defaultPage)
      }
    }
  }

  function handleSubItemClick(mod: ModuleItem, sub: SubItem) {
    setActiveModule(mod.id)
    setActivePage(sub.id)
    setExpandedModule(mod.id)
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen flex-shrink-0 transition-all duration-200 ease-in-out relative",
        isCollapsed ? "w-20" : "w-70"
      )}
      style={{ background: "#0B1E3D" }}
    >
      {/* ── Collapse / Expand toggle ── */}
      <button
        onClick={() => {
          setIsCollapsed(prev => !prev)
          if (!isCollapsed) setExpandedModule("") // close any open submenu when collapsing
        }}
        className="absolute -right-3 top-8 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors"
        style={{ background: "#C8102E", border: "2px solid #0B1E3D" }}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed
          ? <ChevronRight className="h-3.5 w-3.5 text-white" />
          : <ChevronLeft className="h-3.5 w-3.5 text-white" />}
      </button>

      {/* ── Brand / Logo ── */}
      <div
        className={cn(
          "pt-5 pb-4 flex-shrink-0 flex items-center",
          isCollapsed ? "px-0 justify-center" : "px-4"
        )}
        style={{ borderBottom: "1px solid #1E3A6E" }}
      >
        <div className={cn("flex items-center gap-1", isCollapsed && "justify-center")}>
          <div className="w-12 h-12 flex-shrink-0">
            <ImageWithFallback src={insaLogo} alt="INSA Logo" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Information Network Security Administration</p>
              <p className="text-xs mt-0.5" style={{ color: "#4B6EA8" }}>Enterprise Resource Planning</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Section label ── */}
      {!isCollapsed && (
        <div className="px-4 pt-4 pb-1.5 flex-shrink-0">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#2D4A6E" }}>
            Main Menu
          </span>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className="flex-1 px-2 pb-2 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-0.5">
          {visibleModules.map(mod => {
            const Icon         = mod.icon
            const isModActive  = activeModule === mod.id
            const isExpanded   = !isCollapsed && expandedModule === mod.id
            const hasChildren  = mod.subItems.length > 0

            return (
              <li key={mod.id}>
                {/* Module row */}
                <button
                  onClick={() => handleModuleClick(mod)}
                  title={isCollapsed ? mod.label : undefined}
                  className={cn(
                    "w-full flex items-center rounded-lg transition-all duration-150 text-left group",
                    isCollapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-2.5 py-2.5",
                    isModActive && !hasChildren
                      ? "text-white"
                      : isModActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                  style={
                    isModActive && !hasChildren
                      ? { background: "linear-gradient(90deg,#C8102E,#A50E26)", boxShadow: "0 2px 8px rgba(200,16,46,.28)" }
                      : isModActive
                      ? { background: "rgba(200,16,46,0.15)", borderLeft: isCollapsed ? "none" : "2px solid #C8102E" }
                      : {}
                  }
                  onMouseEnter={e => {
                    if (!isModActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"
                  }}
                  onMouseLeave={e => {
                    if (!isModActive) (e.currentTarget as HTMLButtonElement).style.background = ""
                  }}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-all",
                    isModActive ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-semibold truncate">{mod.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={cn("h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200", isExpanded && "rotate-180")}
                          style={{ color: isModActive ? "#FDA4AF" : "#4B6EA8" }}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Sub-items */}
                {hasChildren && isExpanded && (
                  <ul className="mt-0.5 mb-0.5 ml-3 space-y-0.5 border-l" style={{ borderColor: "#1E3A6E" }}>
                    {mod.subItems.map(sub => {
                      if (sub.isDivider) {
                        return (
                          <li key={sub.id} className="pl-3 pt-2 pb-1">
                            <p className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color: "#60A5FA", opacity: 0.7 }}>{sub.label}</p>
                          </li>
                        )
                      }
                      const isSubActive = isModActive && activePage === sub.id
                      return (
                        <li key={sub.id}>
                          <button
                            onClick={() => handleSubItemClick(mod, sub)}
                            className={cn(
                              "w-full flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-r-lg text-left transition-all duration-100 group",
                              isSubActive
                                ? "text-white font-semibold"
                                : "text-slate-300 hover:text-white"
                            )}
                            style={
                              isSubActive
                                ? { background: "linear-gradient(90deg,rgba(200,16,46,0.90),rgba(165,14,38,0.80))", borderLeft: "2px solid #C8102E", marginLeft: "-1px" }
                                : {}
                            }
                            onMouseEnter={e => {
                              if (!isSubActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"
                            }}
                            onMouseLeave={e => {
                              if (!isSubActive) (e.currentTarget as HTMLButtonElement).style.background = ""
                            }}
                          >
                            <Circle
                              className="h-1.5 w-1.5 flex-shrink-0"
                              style={{ color: isSubActive ? "#FDA4AF" : "#3E5E8F" }}
                              fill="currentColor"
                            />
                            <span className="text-sm truncate">{sub.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Notification pill ── */}
      {!isCollapsed && (
        <div
          className="mx-2 mb-2 rounded-lg p-2.5 cursor-pointer flex-shrink-0 transition-colors"
          style={{ background: "rgba(29,78,216,0.14)", border: "1px solid rgba(29,78,216,0.24)" }}
          onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = "rgba(29,78,216,0.22)")}
          onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = "rgba(29,78,216,0.14)")}
        >
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 flex-shrink-0" style={{ color: "#60A5FA" }} />
            <div>
              <div className="text-sm font-semibold text-white">5 Pending Approvals</div>
              <div className="text-xs" style={{ color: "#4B6EA8" }}>Action required</div>
            </div>
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className="flex justify-center mb-2 flex-shrink-0">
          <div
            className="relative w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: "rgba(29,78,216,0.14)", border: "1px solid rgba(29,78,216,0.24)" }}
            title="5 Pending Approvals"
          >
            <Bell className="h-4 w-4" style={{ color: "#60A5FA" }} />
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ background: "#C8102E" }}
            >
              5
            </span>
          </div>
        </div>
      )}

      {/* ── User / Logout ── */}
      <div
        className={cn("pb-4 pt-3 flex-shrink-0", isCollapsed ? "px-2" : "px-2")}
        style={{ borderTop: "1px solid #1E3A6E" }}
      >
        <div className={cn("flex items-center gap-2.5", isCollapsed ? "flex-col gap-2 px-0" : "px-2")}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#C8102E,#1D4ED8)" }}
            title={isCollapsed ? userName : undefined}
          >
            {initials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs truncate" style={{ color: roleColor }}>{displayRole}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="p-1 rounded text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}