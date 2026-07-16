import type { DefaultSession } from "next-auth";

// Extend Auth.js types so `session.roles` / `session.accessToken` are typed.
declare module "next-auth" {
  interface Session {
    roles: string[];
    accessToken?: string;
    user: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
    accessToken?: string;
  }
}
