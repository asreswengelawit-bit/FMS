import { federatedSignOut } from "@/features/shared/auth/actions";

export default function UnauthorizedPage() {
  return (
    <div className="center-screen">
      <div className="card">
        <h1>403</h1>
        <p className="muted">
          You don&apos;t have a role that grants access to this module. Ask an
          admin to assign you a module role in Keycloak.
        </p>
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          <a href="/" className="btn">
            My dashboard
          </a>
          <form action={federatedSignOut}>
            <button type="submit" className="btn btn-ghost">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
