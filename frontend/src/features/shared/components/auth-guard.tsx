"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      window.location.replace("/login");
    } else {
      setReady(true);
    }
  }, [session, status]);

  return ready ? children : <main className="auth-page"><div className="auth-card">Checking your session…</div></main>;
}
