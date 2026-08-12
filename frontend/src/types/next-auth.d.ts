import type { DefaultSession } from "next-auth";

// Extend Auth.js types so `session.roles` / `session.accessToken` are typed.
declare module "next-auth" {
  interface Session {
    roles: string[];
    accessToken?: string;
    idToken?: string;
    /** Set when the Keycloak refresh token no longer works — force a re-login. */
    error?: "RefreshTokenError";
    user: DefaultSession["user"];
  }
}

// `next-auth/jwt` re-exports this interface from @auth/core, and only the
// @auth/core declaration is the one the callbacks are typed against.
declare module "@auth/core/jwt" {
  interface JWT {
    roles?: string[];
    accessToken?: string;
    /** Buys a new access token once the current one expires. */
    refreshToken?: string;
    idToken?: string;
    /** Absolute expiry of `accessToken`, in ms since the epoch. */
    expiresAt?: number;
    error?: "RefreshTokenError";
  }
}
