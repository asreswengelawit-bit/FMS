import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

/**
 * Decode a Keycloak access token (JWT) and pull out its realm roles.
 * The token comes straight from Keycloak's token endpoint over TLS, so we
 * read the payload without re-verifying the signature here.
 * `atob` works in both the Node and Edge runtimes (no Buffer needed).
 */
function decodeRealmRoles(accessToken?: string): string[] {
  if (!accessToken) return [];
  try {
    const payload = accessToken.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json) as { realm_access?: { roles?: string[] } };
    return data.realm_access?.roles ?? [];
  } catch {
    return [];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    // Runs at sign-in (account present) and on every token refresh.
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.roles = decodeRealmRoles(account.access_token);
      }
      return token;
    },
    // Shapes the session object exposed to the app / middleware.
    async session({ session, token }) {
      session.roles = (token.roles as string[] | undefined) ?? [];
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
