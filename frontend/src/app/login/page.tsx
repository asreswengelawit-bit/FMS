"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
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
      // Full reload so middleware re-evaluates the new session and routes by role.
      window.location.href = "/";
    }
  }

  return (
    <div className="auth-wrap">
      {/* Left brand panel */}
      <aside className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-brandcard">
            <img src="/insa.jpg" alt="INSA" />
          </div>
          <div className="auth-accent">
            <span className="line red" />
            <span className="dot" />
            <span className="line blue" />
          </div>
          <h1>Information Network Security Administration</h1>
          <p className="auth-loc">Addis Ababa, Ethiopia</p>
        </div>
        <footer className="auth-left-foot">
          © 2025 Information Network Security Administration
        </footer>
      </aside>

      {/* Right sign-in panel */}
      <main className="auth-right">
        <div className="auth-right-inner">
          <div className="auth-logo-top">
            <img src="/insa.jpg" alt="INSA" />
            <span>INSA ERP System</span>
          </div>

          <div className="auth-card">
            <h2>
              <ShieldIcon />
              Sign In
            </h2>
            <p className="auth-sub">Enter your credentials to access the system</p>

            <form onSubmit={handleSubmit}>
              <label className="field-label">EMAIL ADDRESS</label>
              <div className="input-wrap">
                <UserIcon />
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="you@insa.gov.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label className="field-label">PASSWORD</label>
              <div className="input-wrap">
                <LockIcon />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showPw} />
                </button>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="btn-primary" disabled={loading}>
                <ShieldIcon />
                {loading ? "Signing in…" : "Sign In Securely"}
              </button>
            </form>

            <div className="auth-divider" />
            <p className="auth-policy">
              <LockIcon small />
              This system is protected under the INSA Security Policy.
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---- inline icons (no external deps) ---- */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function LockIcon({ small }: { small?: boolean }) {
  const s = small ? 14 : 18;
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function EyeIcon({ off }: { off?: boolean }) {
  return off ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
