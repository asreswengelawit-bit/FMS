import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Keycloak from "next-auth/providers/keycloak";

// Keep local demo mode bootable when no Keycloak credentials have been
// configured. Production/staging deployments should set KEYCLOAK_ISSUER.
const keycloakIssuer = process.env.KEYCLOAK_ISSUER ?? "http://localhost:8080/realms/erp";

/** Decode a JWT payload (no signature check — tokens come from Keycloak over TLS). */
function decodeJwt(token?: string): Record<string, unknown> {
  if (!token) return {};
  try {
    const p = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(p)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function rolesOf(accessToken?: string): string[] {
  const claims = decodeJwt(accessToken) as { realm_access?: { roles?: string[] } };
  return claims.realm_access?.roles ?? [];
}

/** Absolute expiry (ms) for a Keycloak `expires_in` (seconds), minus a safety margin. */
function expiryOf(expiresIn?: number): number {
  return Date.now() + ((expiresIn ?? 300) - 30) * 1000;
}

/**
 * Swap the refresh token for a fresh access token.
 *
 * Keycloak access tokens live 5 minutes while our session lasts far longer, so
 * without this every API call would start failing with 401 a few minutes after
 * login even though the user still looks signed in.
 */
async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(
    `${keycloakIssuer}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
    },
  );
  if (!res.ok) throw new Error(`Keycloak refresh failed: ${res.status}`);

  return (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    // Branded in-app login form -> Keycloak password grant (ROPC).
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;

        if (process.env.NEXT_PUBLIC_AUTH_MODE === "demo") {
          const email = String(creds.email);
          const password = String(creds.password);
          if (email !== (process.env.DEMO_ADMIN_EMAIL ?? "admin@insa.erp") ||
              password !== (process.env.DEMO_ADMIN_PASSWORD ?? "Admin@123")) {
            return null;
          }

          return {
            id: "demo-admin",
            name: "Demo Administrator",
            email,
            roles: ["admin", "fms_admin"],
          };
        }

        const body = new URLSearchParams({
          grant_type: "password",
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          username: String(creds.email),
          password: String(creds.password),
          scope: "openid profile email",
        });

        const res = await fetch(
          `${keycloakIssuer}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
          },
        );
        if (!res.ok) return null; // bad credentials / account not set up

        const tokens = (await res.json()) as {
          access_token: string;
          refresh_token?: string;
          id_token?: string;
          expires_in?: number;
        };
        const claims = decodeJwt(tokens.access_token) as {
          sub?: string;
          name?: string;
          preferred_username?: string;
          email?: string;
        };

        return {
          id: claims.sub ?? String(creds.email),
          name: claims.name ?? claims.preferred_username,
          email: claims.email ?? String(creds.email),
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          idToken: tokens.id_token,
          expiresAt: expiryOf(tokens.expires_in),
          roles: rolesOf(tokens.access_token),
        };
      },
    }),
    // Kept as an alternative: full Keycloak redirect login (SSO page).
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: keycloakIssuer,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Redirect (Keycloak provider) sign-in.
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at
          ? account.expires_at * 1000
          : expiryOf(account.expires_in as number | undefined);
        token.roles = rolesOf(account.access_token);
        return token;
      }
      // Credentials (password grant) sign-in — tokens ride on `user`.
      const u = user as
        | {
            accessToken?: string;
            refreshToken?: string;
            idToken?: string;
            expiresAt?: number;
            roles?: string[];
          }
        | undefined;
      if (u?.accessToken) {
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.idToken = u.idToken;
        token.expiresAt = u.expiresAt;
        token.roles = u.roles ?? [];
        return token;
      }
      // Demo mode: `authorize` returns roles without an access token. Carry
      // them into the session so the middleware can authorise module access.
      // (Checked after the access-token branch above; demo users have none.)
      if (u?.roles) {
        token.roles = u.roles;
        return token;
      }

      // Subsequent requests: hand back the token until it is close to expiring.
      if (token.expiresAt && Date.now() < token.expiresAt) return token;

      // Sessions minted before refresh support carry neither an expiry nor a
      // refresh token. Return them untouched: mutating the token here makes
      // Auth.js re-issue the session cookie on *every* call, including inside
      // server actions that then redirect, which is not a safe place to write
      // one. The access token is simply stale, and the API answers 401.
      if (!token.refreshToken || !token.expiresAt) {
        return token;
      }

      try {
        const refreshed = await refreshAccessToken(token.refreshToken);
        token.accessToken = refreshed.access_token;
        // Keycloak rotates refresh tokens, so keep the new one when it sends it.
        token.refreshToken = refreshed.refresh_token ?? token.refreshToken;
        token.idToken = refreshed.id_token ?? token.idToken;
        token.expiresAt = expiryOf(refreshed.expires_in);
        // Roles can change between refreshes; always re-read them.
        token.roles = rolesOf(refreshed.access_token);
        delete token.error;
      } catch {
        // The Keycloak SSO session is gone — the user has to sign in again.
        token.error = "RefreshTokenError";
      }
      return token;
    },
    async session({ session, token }) {
      session.roles = (token.roles as string[] | undefined) ?? [];
      session.accessToken = token.accessToken as string | undefined;
      session.idToken = token.idToken as string | undefined;
      session.error = token.error as "RefreshTokenError" | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
