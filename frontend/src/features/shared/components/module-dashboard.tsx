import type { CSSProperties } from "react";
import { auth } from "@/auth";

const styles: Record<string, CSSProperties> = {
  muted: { color: "#6b6b80", fontSize: "0.9rem" },
  heading: { margin: "0 0 0.3rem", fontSize: "1.6rem", color: "#16233f" },
  label: { marginTop: "1.5rem" },
  badge: {
    display: "inline-block",
    background: "#ece9ff",
    color: "#4b3fce",
    borderRadius: "999px",
    padding: "0.15rem 0.6rem",
    fontSize: "0.8rem",
    margin: "0.15rem",
  },
};

/**
 * Shared placeholder dashboard for a module. Reaching a module page already
 * means middleware confirmed the user's role, so this just greets them and
 * shows the roles carried in their Keycloak token.
 */
export default async function ModuleDashboard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const session = await auth();
  const roles = session?.roles ?? [];

  return (
    <div>
      <h1 style={styles.heading}>{title}</h1>
      <p style={styles.muted}>{description}</p>

      <p style={styles.label}>Your roles from Keycloak:</p>
      <div>
        {roles.length ? (
          roles.map((r) => (
            <span key={r} style={styles.badge}>
              {r}
            </span>
          ))
        ) : (
          <span style={styles.muted}>none</span>
        )}
      </div>
    </div>
  );
}
