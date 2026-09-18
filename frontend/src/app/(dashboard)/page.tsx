import type { CSSProperties } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { modulesForRoles, type ModuleDef } from "@/features/shared/config/roles";
import { Icon, type IconName } from "@/features/shared/components/icons";

const MODULE_COPY: Record<string, { description: string; icon: IconName }> = {
  hrm: {
    description: "Employees, departments, attendance, leave and payroll support.",
    icon: "users",
  },
  prms: {
    description: "Suppliers, purchase requisitions, purchase orders and receipts.",
    icon: "clipboard",
  },
  mms: {
    description: "Item master, inventory, warehouses, stock movements and goods receipts.",
    icon: "grid",
  },
  crm: {
    description: "Leads, quotations, sales orders, invoices and customers.",
    icon: "activity",
  },
  fms: {
    description: "Chart of accounts, journals, invoices, payments and financial reports.",
    icon: "receipt",
  },
};

const styles: Record<string, CSSProperties> = {
  heading: { margin: "0 0 0.3rem", fontSize: "1.6rem", color: "#16233f" },
  muted: { color: "#6b6b80", margin: "0 0 1.4rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1rem",
  },
  card: {
    display: "block",
    border: "1px solid #e2e6ee",
    borderRadius: "12px",
    padding: "1.1rem 1.2rem",
    background: "#fff",
    textDecoration: "none",
    color: "inherit",
    transition: "border-color .15s, box-shadow .15s",
  },
  titleRow: { display: "flex", alignItems: "center", gap: "0.6rem" },
  icon: { color: "#c1121f" },
  cardTitle: { margin: 0, fontSize: "1.05rem", color: "#16233f" },
  cardDesc: { margin: "0.5rem 0 0", color: "#6b6b80", fontSize: "0.88rem", lineHeight: 1.45 },
  open: { marginTop: "0.7rem", color: "#4b3fce", fontSize: "0.85rem", fontWeight: 600 },
};

function description(m: ModuleDef): string {
  return MODULE_COPY[m.key]?.description ?? `Open the ${m.label} module.`;
}

function iconName(m: ModuleDef): IconName {
  return MODULE_COPY[m.key]?.icon ?? "grid";
}

// Landing route. Instead of silently depositing the user inside one module,
// show every module their roles grant access to so nothing gets hidden.
export default async function DashboardHome() {
  const session = await auth();
  const modules = modulesForRoles(session?.roles ?? []);
  const name = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <div>
      <h1 style={styles.heading}>Welcome back, {name}</h1>
      <p style={styles.muted}>Select a module to get started.</p>

      {modules.length === 0 ? (
        <p style={styles.muted}>
          Your account has no module entitlements yet. Contact your administrator.
        </p>
      ) : (
        <div style={styles.grid}>
          {modules.map((m) => (
            <Link key={m.key} href={m.path} style={styles.card}>
              <div style={styles.titleRow}>
                <Icon name={iconName(m)} size={20} />
                <h2 style={styles.cardTitle}>{m.label}</h2>
              </div>
              <p style={styles.cardDesc}>{description(m)}</p>
              <div style={styles.open}>Open module →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}