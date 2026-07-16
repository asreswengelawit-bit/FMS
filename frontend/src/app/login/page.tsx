import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="center-screen">
      <div className="card">
        <h1>INSA-ERP</h1>
        <p className="muted">Sign in to continue to your dashboard.</p>
        <form
          action={async () => {
            "use server";
            // Redirect to Keycloak; after login land on "/" which routes by role.
            await signIn("keycloak", { redirectTo: "/" });
          }}
        >
          <button type="submit" className="btn" style={{ marginTop: "1rem" }}>
            Sign in with Keycloak
          </button>
        </form>
      </div>
    </div>
  );
}
