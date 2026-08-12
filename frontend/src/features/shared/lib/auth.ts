import type { MmsRole, MmsUser } from "@/features/mms/types";

export const authMode = process.env.NEXT_PUBLIC_AUTH_MODE ?? "demo";
export const keycloakIssuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ?? "http://localhost:8080/realms/erp";
export const keycloakClientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "erp-frontend";

const base64Url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

export async function beginKeycloakLogin() {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(48)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  sessionStorage.setItem("erp_pkce_verifier", verifier);
  const redirectUri = `${window.location.origin}/auth/callback`;
  const params = new URLSearchParams({ client_id: keycloakClientId, redirect_uri: redirectUri, response_type: "code", scope: "openid profile email", code_challenge: base64Url(new Uint8Array(digest)), code_challenge_method: "S256" });
  window.location.assign(`${keycloakIssuer}/protocol/openid-connect/auth?${params}`);
}

export async function exchangeAuthorizationCode(code: string) {
  const verifier = sessionStorage.getItem("erp_pkce_verifier");
  const response = await fetch(`${keycloakIssuer}/protocol/openid-connect/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "authorization_code", client_id: keycloakClientId, redirect_uri: `${window.location.origin}/auth/callback`, code, code_verifier: verifier ?? "" }) });
  if (!response.ok) throw new Error("Keycloak sign-in failed");
  const tokens = await response.json() as { access_token: string; refresh_token?: string };
  sessionStorage.setItem("erp_access_token", tokens.access_token);
  if (tokens.refresh_token) sessionStorage.setItem("erp_refresh_token", tokens.refresh_token);
  sessionStorage.removeItem("erp_pkce_verifier");
}

export function userFromAccessToken(): MmsUser | null {
  const token = sessionStorage.getItem("erp_access_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replaceAll("-", "+").replaceAll("_", "/"))) as { sub?: string; name?: string; preferred_username?: string; realm_access?: { roles?: string[] } };
    const roles = payload.realm_access?.roles ?? [];
    const role: MmsRole = roles.includes("inventory_manager") ? "inventory_manager" : roles.includes("store_keeper") ? "store_keeper" : "viewer";
    const permissions: MmsUser["permissions"] = role === "inventory_manager" ? ["mms:read", "mms:write", "mms:approve", "mms:export"] : role === "store_keeper" ? ["mms:read", "mms:write", "mms:export"] : ["mms:read"];
    return { id: payload.sub ?? "keycloak-user", name: payload.name ?? payload.preferred_username ?? "ERP User", role, permissions };
  } catch { return null; }
}
