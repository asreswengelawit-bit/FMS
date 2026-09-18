"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, Shield, User } from "lucide-react";

import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel — hidden on small screens, as before */}
      <aside className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-[radial-gradient(1200px_600px_at_30%_40%,#0d2a5c_0%,#0a1f44_60%,#071634_100%)] p-12 text-white md:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_45%,transparent_0_118px,rgba(255,255,255,0.05)_118px_120px,transparent_120px_218px,rgba(255,255,255,0.04)_218px_220px,transparent_220px_330px,rgba(255,255,255,0.03)_330px_332px,transparent_332px)]"
        />
        <div className="relative max-w-[480px] text-center">
          <div className="mx-auto mb-8 grid size-[190px] place-items-center rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/insa.jpg" alt="INSA" className="size-[74%] object-contain" />
          </div>

          <div className="mb-6 flex items-center justify-center gap-1.5">
            <span className="h-[3px] w-11 rounded-sm bg-[#c1121f]" />
            <span className="size-[9px] rounded-full bg-[#c1121f]" />
            <span className="h-[3px] w-11 rounded-sm bg-[#1e50c8]" />
          </div>

          <h1 className="mb-3 text-[2.4rem] font-extrabold leading-tight">
            Information Network Security Administration
          </h1>
          <p className="m-0 text-white/55">Addis Ababa, Ethiopia</p>
        </div>

        <footer className="absolute inset-x-0 bottom-6 text-center text-xs text-white/40">
          © 2026 Information Network Security Administration
        </footer>
      </aside>

      {/* Sign-in panel */}
      <main className="grid flex-1 place-items-center bg-[#f4f6fb] p-8">
        <div className="w-full max-w-[440px]">
          <div className="mb-6 flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/insa.jpg" alt="INSA" className="size-[88px] object-contain" />
            <span className="text-xl font-bold text-[#0a1f44]">INSA ERP System</span>
          </div>

          <div className="rounded-2xl bg-card p-8 shadow-[0_12px_40px_rgba(10,31,68,0.1)]">
            <h2 className="mb-1.5 flex items-center gap-2 text-2xl font-semibold text-[#14213d]">
              <Shield className="size-5 text-primary" />
              Sign In
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {process.env.NEXT_PUBLIC_AUTH_MODE === "demo"
                ? "Use the local administrator account to access the system"
                : "Enter your credentials to access the system"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold tracking-wider text-muted-foreground">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    autoComplete="username"
                    placeholder="you@insa.gov.et"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold tracking-wider text-muted-foreground">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 px-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading} size="lg" className="w-full">
                <Shield className="size-4" />
                {loading ? "Signing in…" : "Sign In Securely"}
              </Button>
            </form>

            {process.env.NEXT_PUBLIC_AUTH_MODE === "demo" && (
              <p className="mt-4 text-xs text-muted-foreground">
                Local demo: admin@insa.erp / Admin@123
              </p>
            )}

            <div className="my-5 h-px bg-border" />

            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 size-3.5 shrink-0" />
              This system is protected under the INSA Security Policy. Unauthorized access
              attempts are logged and monitored.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
