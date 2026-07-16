import { auth } from "@/auth";
import { federatedSignOut } from "@/features/shared/auth/actions";
import { modulesForRoles } from "@/features/shared/config/roles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const roles = session?.roles ?? [];
  const modules = modulesForRoles(roles);
  const name = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/insa.jpg" alt="INSA" className="brand-logo" />
          <span>INSA-ERP</span>
        </div>
        {modules.length === 0 && (
          <span className="muted">No modules assigned</span>
        )}
        {modules.map((m) => (
          <a key={m.key} href={m.path}>
            {m.label}
          </a>
        ))}
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="muted">
            Signed in as <strong>{name}</strong>
          </span>
          <form action={federatedSignOut}>
            <button type="submit" className="btn btn-ghost">
              Sign out
            </button>
          </form>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
