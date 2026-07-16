"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

/**
 * Full logout: clears the app session AND the Keycloak SSO session.
 *
 * A plain signOut() only drops the local cookie, so Keycloak's own SSO cookie
 * survives and silently logs the same user back in (no password prompt). Here we
 * also redirect the browser through Keycloak's end-session endpoint so the next
 * login genuinely asks for credentials.
 */
export async function federatedSignOut() {
  const session = await auth();
  const idToken = session?.idToken;

  // Clear the local Auth.js session (no redirect yet).
  await signOut({ redirect: false });

  // Build Keycloak's logout URL back to our /login page.
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const params = new URLSearchParams({
    // client_id lets Keycloak validate the redirect even when id_token_hint is
    // absent (e.g. sessions created before id_token was captured).
    client_id: process.env.KEYCLOAK_CLIENT_ID ?? "",
    post_logout_redirect_uri: `${origin}/login`,
  });
  if (idToken) params.set("id_token_hint", idToken);

  redirect(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params.toString()}`,
  );
}
