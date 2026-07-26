import { auth } from "@/auth";

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
      <h1>{title}</h1>
      <p className="muted">{description}</p>

      <p style={{ marginTop: "1.5rem" }}>Your roles from Keycloak:</p>
      <div>
        {roles.length ? (
          roles.map((r) => (
            <span key={r} className="badge">
              {r}
            </span>
          ))
        ) : (
          <span className="muted">none</span>
        )}
      </div>
    </div>
  );
}
