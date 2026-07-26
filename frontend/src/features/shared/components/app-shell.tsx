"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { federatedSignOut } from "@/features/shared/auth/actions";
import type { ModuleDef } from "@/features/shared/config/roles";

// Module display titles.
const MODULE_TITLE: Record<string, string> = {
  hrm: "Human Resource Management",
};

// HR sidebar sub-navigation per job role (dummy routes -> /hrm for now).
const p = (label: string) => ({ label, path: "/hrm" });
const HR_SUBNAV: Record<string, { label: string; path: string }[]> = {
  hrm_admin: [
    p("Dashboard"), p("Employees"), p("Departments"), p("Positions"),
    p("Attendance"), p("Leave"), p("Payroll Support"),
    p("Assignment History"), p("Reports"), p("Audit Log"),
  ],
  hrm_operations_manager: [
    p("Dashboard"), p("Attendance"), p("Leave"), p("Payroll Support"), p("Reports"),
  ],
  hrm_recruitment_officer: [
    p("Dashboard"), p("Positions"), p("Candidates"), p("Interviews"), p("Reports"),
  ],
  hrm_department_manager: [
    p("Dashboard"), p("My Team"), p("Team Attendance"), p("Approvals"),
  ],
  hrm_employee: [p("Dashboard"), p("My Attendance"), p("My Leave"), p("My Profile")],
  hrm_user: [p("Dashboard")],
};

export default function AppShell({
  userName,
  modules,
  hrRole = "hrm_user",
  children,
}: {
  userName: string;
  modules: ModuleDef[];
  hrRole?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const active = modules.find(
    (m) => pathname === m.path || pathname.startsWith(m.path + "/"),
  );
  const [open, setOpen] = useState<string>(active?.key ?? modules[0]?.key ?? "");
  const title = active ? (MODULE_TITLE[active.key] ?? active.label) : "Dashboard";

  return (
    <div className={`dash-shell${collapsed ? " collapsed" : ""}`}>
      <aside className="dash-side">
        <div className="dash-side-head">
          <img src="/insa.jpg" alt="INSA" />
          {!collapsed && (
            <div>
              <strong>Information Network Security Administration</strong>
              <span>Enterprise Resource Planning</span>
            </div>
          )}
        </div>

        <nav className="dash-nav">
          {!collapsed && <p className="dash-menu-label">MAIN MENU</p>}

          <Link
            href="/"
            className={`dash-nav-item${pathname === "/" ? " active" : ""}`}
          >
            <GridIcon />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          {modules.map((m) => {
            const items =
              m.key === "hrm"
                ? (HR_SUBNAV[hrRole] ?? HR_SUBNAV.hrm_user)
                : [{ label: "Dashboard", path: m.path }];
            const isOpen = open === m.key;
            const isActive = active?.key === m.key;
            return (
              <div key={m.key}>
                <button
                  className={`dash-nav-item${isActive ? " active" : ""}`}
                  onClick={() => setOpen(isOpen ? "" : m.key)}
                >
                  <UsersIcon />
                  {!collapsed && (
                    <>
                      <span>{m.label}</span>
                      <span className={`chev${isOpen ? " up" : ""}`}>⌃</span>
                    </>
                  )}
                </button>
                {!collapsed && isOpen && (
                  <div className="dash-sub">
                    {items.map((it, i) => (
                      <Link
                        key={it.label}
                        href={it.path}
                        className={`dash-sub-item${
                          i === 0 && isActive ? " active" : ""
                        }`}
                      >
                        <span className="bullet" />
                        {it.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="dash-side-foot">
          <form action={federatedSignOut}>
            <button type="submit" className="dash-signout">
              {collapsed ? "⎋" : "Sign out"}
            </button>
          </form>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-collapse"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
          >
            ‹
          </button>
          <div className="dash-crumb">
            <strong>{title}</strong>
            <span>›</span>
            <em>Dashboard</em>
            <p>INSA Enterprise Resource Planning System</p>
          </div>
          <div className="dash-search">
            <input placeholder="Search…" />
          </div>
          <div className="dash-bell">
            🔔<span className="dot">5</span>
          </div>
          <div className="dash-user" title={userName}>
            {userName.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
