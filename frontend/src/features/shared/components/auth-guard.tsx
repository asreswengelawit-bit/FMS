"use client";

import { useEffect, useState } from "react";
import { authMode } from "../lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(authMode !== "keycloak");
  useEffect(() => {
    if (authMode !== "keycloak") return;
    if (!sessionStorage.getItem("erp_access_token")) window.location.replace("/login");
    else setReady(true);
  }, []);
  return ready ? children : <main className="auth-page"><div className="auth-card">Checking your session…</div></main>;
}
