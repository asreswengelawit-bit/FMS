"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

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
      window.location.href = "/";
    }
  }

  return (
    <Wrap>
      <Left>
        <LeftInner>
          <BrandCard>
            <img src="/insa.jpg" alt="INSA" />
          </BrandCard>
          <Accent>
            <span className="line red" />
            <span className="dot" />
            <span className="line blue" />
          </Accent>
          <h1>Information Network Security Administration</h1>
          <Loc>Addis Ababa, Ethiopia</Loc>
        </LeftInner>
        <LeftFoot>© 2025 Information Network Security Administration</LeftFoot>
      </Left>

      <Right>
        <RightInner>
          <LogoTop>
            <img src="/insa.jpg" alt="INSA" />
            <span>INSA ERP System</span>
          </LogoTop>

          <Card>
            <h2>
              <ShieldIcon />
              Sign In
            </h2>
            <Sub>Enter your credentials to access the system</Sub>

            <form onSubmit={handleSubmit}>
              <FieldLabel>EMAIL ADDRESS</FieldLabel>
              <InputWrap>
                <UserIcon />
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="you@insa.gov.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrap>

              <FieldLabel>PASSWORD</FieldLabel>
              <InputWrap>
                <LockIcon />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Eye
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showPw} />
                </Eye>
              </InputWrap>

              {error && <ErrorBox>{error}</ErrorBox>}

              <PrimaryButton type="submit" disabled={loading}>
                <ShieldIcon />
                {loading ? "Signing in…" : "Sign In Securely"}
              </PrimaryButton>
            </form>

            <Divider />
            <Policy>
              <LockIcon small />
              This system is protected under the INSA Security Policy.
              Unauthorized access attempts are logged and monitored.
            </Policy>
          </Card>
        </RightInner>
      </Right>
    </Wrap>
  );
}

/* ------------------------------- styles ------------------------------- */
const Wrap = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Left = styled.aside`
  position: relative;
  flex: 1 1 50%;
  background: radial-gradient(
    1200px 600px at 30% 40%,
    ${theme.navy2} 0%,
    ${theme.navy} 60%,
    #071634 100%
  );
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle at 45% 45%,
      transparent 0 118px,
      rgba(255, 255, 255, 0.05) 118px 120px,
      transparent 120px 218px,
      rgba(255, 255, 255, 0.04) 218px 220px,
      transparent 220px 330px,
      rgba(255, 255, 255, 0.03) 330px 332px,
      transparent 332px
    );
    pointer-events: none;
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

const LeftInner = styled.div`
  position: relative;
  text-align: center;
  max-width: 480px;

  h1 {
    font-size: 2.4rem;
    line-height: 1.15;
    font-weight: 800;
    margin: 0 0 0.75rem;
  }
`;

const BrandCard = styled.div`
  width: 190px;
  height: 190px;
  margin: 0 auto 2rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  backdrop-filter: blur(4px);

  img {
    width: 74%;
    height: 74%;
    object-fit: contain;
  }
`;

const Accent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 1.5rem;

  .line {
    width: 44px;
    height: 3px;
    border-radius: 2px;
  }
  .line.red {
    background: ${theme.red2};
  }
  .line.blue {
    background: ${theme.blue};
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${theme.red2};
  }
`;

const Loc = styled.p`
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.95rem;
  margin: 0;
`;

const LeftFoot = styled.footer`
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
`;

const Right = styled.main`
  flex: 1 1 50%;
  background: #f4f6fb;
  display: grid;
  place-items: center;
  padding: 2rem;
`;

const RightInner = styled.div`
  width: 100%;
  max-width: 440px;
`;

const LogoTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  img {
    width: 88px;
    height: 88px;
    object-fit: contain;
  }
  span {
    font-weight: 700;
    font-size: 1.2rem;
    color: ${theme.navy};
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 12px 40px rgba(10, 31, 68, 0.1);

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.35rem;
    font-size: 1.6rem;
    color: #14213d;

    svg {
      color: ${theme.red2};
    }
  }
`;

const Sub = styled.p`
  color: #6b7280;
  margin: 0 0 1.5rem;
  font-size: 0.92rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin: 0 0 0.4rem;
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0 0.85rem;
  margin-bottom: 1.1rem;
  transition: border-color 0.15s, background 0.15s;

  &:focus-within {
    background: #fff;
    border-color: ${theme.red2};
  }

  svg {
    color: #9ca3af;
    flex: none;
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 0.8rem 0;
    font-size: 0.95rem;
    color: #14213d;
  }
`;

const Eye = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9ca3af;
  display: grid;
  place-items: center;
  padding: 0;
`;

const PrimaryButton = styled.button`
  width: 100%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(180deg, ${theme.red2}, ${theme.red});
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: 10px;
  margin-top: 0.4rem;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(1.06);
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const ErrorBox = styled.p`
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  margin: 0 0 1rem;
`;

const Divider = styled.div`
  height: 1px;
  background: #eceff3;
  margin: 1.5rem 0 1rem;
`;

const Policy = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;

  svg {
    flex: none;
    margin-top: 2px;
  }
`;

/* ------------------------------- icons ------------------------------- */
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
