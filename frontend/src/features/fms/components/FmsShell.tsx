"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { federatedSignOut } from "@/features/shared/auth/actions";
import { Icon } from "@/features/shared/components/icons";
import { theme } from "@/styles/theme";
import { FMS_NAV } from "@/features/shared/config/navigation/fms-nav";

export default function FmsShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthed = Boolean(userName);

  const active = FMS_NAV.find(
    (item) => pathname === item.path || pathname.startsWith(item.path + "/"),
  );

  return (
    <Shell>
      <Side>
        <SideHead>
          <img src="/insa.jpg" alt="INSA" />
          <div>
            <strong>Financial Management System</strong>
            <span>INSA Enterprise Resource Planning</span>
          </div>
        </SideHead>

        <Nav>
          <NavLink href="/" $active={pathname === "/"}>
            <Icon name="grid" />
            <span>All Modules</span>
          </NavLink>
          <MenuLabel>FMS MENU</MenuLabel>
          <NavLink href="/fms" $active={pathname === "/fms" || pathname === "/"}>
            <Icon name="grid" />
            <span>Dashboard</span>
          </NavLink>
          {FMS_NAV.map((item) => {
            const isActive = pathname === item.path;
            return (
              <NavLink key={item.path} href={item.path} $active={isActive}>
                <Icon name="receipt" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </Nav>

        <SideFoot>
          <form action={federatedSignOut}>
            <SignOut type="submit">
              <Icon name="logout" size={16} />
              <span>Sign out</span>
            </SignOut>
          </form>
        </SideFoot>
      </Side>

      <Main>
        <TopBar>
          <Crumb>
            <strong>{active ? active.label : "Dashboard"}</strong>
            <span>›</span>
            <p>Financial Management System</p>
          </Crumb>

          <Actions>
            {isAuthed ? (
              <>
                <UserBadge title={userName}>
                  {userName.charAt(0).toUpperCase()}
                </UserBadge>
                <form action={federatedSignOut}>
                  <LogoutBtn type="submit">
                    <Icon name="logout" size={15} />
                    Log out
                  </LogoutBtn>
                </form>
              </>
            ) : (
              <LoginLink href="/login">
                <Icon name="logout" size={15} />
                Log in
              </LoginLink>
            )}
          </Actions>
        </TopBar>

        <Content>{children}</Content>
      </Main>
    </Shell>
  );
}

/* ------------------------------- styles ------------------------------- */
const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f3f5f9;
`;

const Side = styled.aside`
  width: 264px;
  flex: none;
  background: ${theme.navy};
  color: #c9d2e3;
  display: flex;
  flex-direction: column;
`;

const SideHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1.1rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    background: #fff;
    border-radius: 8px;
    padding: 3px;
    flex: none;
  }
  strong {
    display: block;
    color: #fff;
    font-size: 0.82rem;
    line-height: 1.2;
  }
  span {
    color: #7f8db0;
    font-size: 0.72rem;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 0.75rem 0.6rem;
  overflow-y: auto;
`;

const MenuLabel = styled.p`
  color: #6b779b;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  margin: 0.5rem 0.5rem 0.6rem;
`;

const navItem = css<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.75rem;
  border: none;
  background: transparent;
  color: #c9d2e3;
  font-size: 0.92rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
  ${(p) =>
    p.$active &&
    css`
      background: linear-gradient(90deg, ${theme.red}, ${theme.red2});
      color: #fff;
    `}
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  ${navItem}
  margin-bottom: 0.2rem;
`;

const SideFoot = styled.div`
  padding: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
`;

const SignOut = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  color: #c9d2e3;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.55rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }
`;

const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e8ebf1;
`;

const Crumb = styled.div`
  strong {
    color: ${theme.navy};
    font-size: 1rem;
  }
  span {
    color: #c1c7d4;
    margin: 0 0.35rem;
  }
  p {
    margin: 0;
    color: #97a0b5;
    font-size: 0.78rem;
  }
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserBadge = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${theme.navy};
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  flex: none;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #e2e6ee;
  background: #fff;
  color: ${theme.navy};
  font-weight: 600;
  font-size: 0.88rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f6f7fb;
  }
`;

const LoginLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #e2e6ee;
  background: #fff;
  color: ${theme.navy};
  font-weight: 600;
  font-size: 0.88rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: #f6f7fb;
  }
`;

const Content = styled.main`
  padding: 1.5rem;
  overflow-y: auto;
`;
