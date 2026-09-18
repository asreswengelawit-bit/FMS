"use client";

import "../mms.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "./icons";
import { useMms } from "../hooks/mms-store";

const nav: { href: string; label: string; icon: IconName }[] = [
  { href:"/mms", label:"MMS Overview", icon:"dashboard" },
  { href:"/mms/items", label:"Item Master", icon:"box" },
  { href:"/mms/inventory", label:"Inventory", icon:"layers" },
  { href:"/mms/warehouses", label:"Warehouses", icon:"warehouse" },
  { href:"/mms/suppliers", label:"Suppliers", icon:"box" },
  { href:"/mms/stock-levels", label:"Stock Levels", icon:"layers" },
  { href:"/mms/stock-movements", label:"Stock Movements", icon:"movement" },
  { href:"/mms/goods-receipts", label:"Goods Receipts", icon:"receipt" },
  { href:"/mms/requisitions", label:"Requisitions", icon:"clipboard" },
  { href:"/mms/reports", label:"Reports & Analytics", icon:"report" },
];

const pageNames: Record<string,string> = {
  "/mms":"Overview", "/mms/items":"Item Master", "/mms/warehouses":"Warehouses",
  "/mms/suppliers":"Suppliers",
  "/mms/inventory":"Inventory",
  "/mms/stock-levels":"Stock Levels", "/mms/stock-movements":"Stock Movements",
  "/mms/goods-receipts":"Goods Receipts", "/mms/requisitions":"Requisitions",
  "/mms/reports":"Reports & Analytics",
};

export function MmsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open,setOpen] = useState(false);
  const { user, toasts, dismissToast, loading, error, signOut } = useMms();
  const pageName = pageNames[pathname] ?? "Material Management";
  const isActive = (href:string) => href === "/mms" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="mms-app">
      {open && <button className="mobile-overlay" aria-label="Close navigation" onClick={()=>setOpen(false)} />}
      <aside className={`mms-sidebar ${open ? "open" : ""}`}>
        <div className="mms-brand">
          <div className="brand-mark">IN</div>
          <div><div className="brand-title">INSA ERP</div><div className="brand-subtitle">Enterprise Resource Planning</div></div>
        </div>
        <div className="sidebar-scroll">
          <div className="nav-eyebrow">MATERIALS</div>
          <nav className="mms-nav" aria-label="Material management navigation">
            {nav.map((item)=>(
              <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={`nav-link ${isActive(item.href) ? "active" : ""}`}>
                <Icon name={item.icon} className="nav-icon"/><span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="nav-eyebrow" style={{marginTop:24}}>SYSTEM</div>
          <div className="mms-nav">
            <Link href="/" onClick={()=>setOpen(false)} className="nav-link"><Icon name="dashboard" className="nav-icon"/>All Modules</Link>
            <span className="nav-link"><Icon name="settings" className="nav-icon"/>Settings</span>
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="profile">
            <div className="profile-avatar">DA</div>
            <div className="profile-copy"><div className="profile-name">{user.name}</div><div className="profile-role">{user.role.replaceAll("_", " ")}</div></div>
            <button className="sidebar-toggle" aria-label="Sign out" onClick={signOut}><Icon name="logout" width="15"/></button>
          </div>
        </div>
      </aside>
      <main className="mms-main">
        {loading && <div className="loading-bar" aria-label="Loading"/>}
        <header className="topbar">
          <div className="topbar-left">
            <button className="top-action mobile-menu" onClick={()=>setOpen(true)} aria-label="Open navigation"><Icon name="menu" width="17"/></button>
            <span className="breadcrumb-home">INSA ERP</span><span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-home">MMS</span><span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{pageName}</span>
          </div>
          <div className="topbar-right">
            <div className="date-chip">Fiscal Period · July 2025</div>
            <button className="top-action" aria-label="Notifications"><Icon name="bell" width="16"/><i className="notification-dot"/></button>
          </div>
        </header>
        {error && <div className="app-error"><Icon name="alert" width="15" />{error}</div>}
        {children}
      </main>
      <div className="toast-region" aria-live="polite">{toasts.map(toast=><button key={toast.id} className={`toast toast-${toast.tone}`} onClick={()=>dismissToast(toast.id)}>{toast.message}<Icon name="close" width="13"/></button>)}</div>
    </div>
  );
}
