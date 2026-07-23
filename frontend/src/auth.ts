import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Keycloak from "next-auth/providers/keycloak";

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

        const body = new URLSearchParams({
          grant_type: "password",
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          username: String(creds.email),
          password: String(creds.password),
          scope: "openid profile email",
        });

        const res = await fetch(
          `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
          },
        );
        if (!res.ok) return null; // bad credentials / account not set up

        const tokens = (await res.json()) as {
          access_token: string;
          id_token?: string;
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
          idToken: tokens.id_token,
          roles: rolesOf(tokens.access_token),
        };
      },
    }),
    // Kept as an alternative: full Keycloak redirect login (SSO page).
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Redirect (Keycloak provider) sign-in.
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.roles = rolesOf(account.access_token);
      }
      // Credentials (password grant) sign-in — tokens ride on `user`.
      const u = user as
        | { accessToken?: string; idToken?: string; roles?: string[] }
        | undefined;
      if (u?.accessToken) {
        token.accessToken = u.accessToken;
        token.idToken = u.idToken;
        token.roles = u.roles ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      session.roles = (token.roles as string[] | undefined) ?? [];
      session.accessToken = token.accessToken as string | undefined;
      session.idToken = token.idToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
