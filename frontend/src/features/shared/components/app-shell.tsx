"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { federatedSignOut } from "@/features/shared/auth/actions";
import { Icon } from "@/features/shared/components/icons";
import { theme } from "@/styles/theme";
import type { ModuleDef } from "@/features/shared/config/roles";
import { CRM_NAV } from "@/features/shared/config/navigation/crm-nav";

const MODULE_TITLE: Record<string, string> = {
  hrm: "Human Resource Management",
  crm: "Sales & Customer Relationship Management",
};

const p = (label: string) => ({ label, path: "/hrm" });
const HR_SUBNAV: Record<string, { label: string; path: string }[]> = {
  hrm_admin: [
    p("Dashboard"), p("Employees"), p("Departments"), p("Positions"),
    p("Attendance"), p("Leave"), p("Payroll Support"),
    p("Assignment History"), p("Reports"), p("Audit Log"),
  ],
  hrm_operations_manager: [
    p("Dashboard"), p("Attendance"), p("Leave"), p("Payroll Support"), p("Reports"),
  ],
  hrm_recruitment_officer: [
    p("Dashboard"), p("Positions"), p("Candidates"), p("Interviews"), p("Reports"),
  ],
  hrm_department_manager: [
    p("Dashboard"), p("My Team"), p("Team Attendance"), p("Approvals"),
  ],
  hrm_employee: [p("Dashboard"), p("My Attendance"), p("My Leave"), p("My Profile")],
  hrm_user: [p("Dashboard")],
};

export default function AppShell({
  userName,
  modules,
  hrRole = "hrm_user",
  children,
}: {
  userName: string;
  modules: ModuleDef[];
  hrRole?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const active = modules.find(
    (m) => pathname === m.path || pathname.startsWith(m.path + "/"),
  );
  const [open, setOpen] = useState<string>(active?.key ?? modules[0]?.key ?? "");
  const title = active ? (MODULE_TITLE[active.key] ?? active.label) : "Dashboard";

  return (
    <Shell>
      <Side $collapsed={collapsed}>
        <SideHead>
          <img src="/insa.jpg" alt="INSA" />
          {!collapsed && (
            <div>
              <strong>Information Network Security Administration</strong>
              <span>Enterprise Resource Planning</span>
            </div>
          )}
        </SideHead>

        <Nav>
          {!collapsed && <MenuLabel>MAIN MENU</MenuLabel>}

          <NavLink href="/" $active={pathname === "/"}>
            <Icon name="grid" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          {modules.map((m) => {
            const items =
              m.key === "hrm"
                ? (HR_SUBNAV[hrRole] ?? HR_SUBNAV.hrm_user)
                : m.key === "crm"
                  ? [...CRM_NAV]
                  : [{ label: "Dashboard", path: m.path }];
            const isOpen = open === m.key;
            const isActive = active?.key === m.key;
            return (
              <div key={m.key}>
                <NavButton
                  $active={isActive}
                  onClick={() => setOpen(isOpen ? "" : m.key)}
                >
                  <Icon name="users" />
                  {!collapsed && (
                    <>
                      <span>{m.label}</span>
                      <Chev name="chevronDown" size={14} $open={isOpen} />
                    </>
                  )}
                </NavButton>
                {!collapsed && isOpen && (
                  <Sub>
                    {items.map((it) => {
                      const subActive =
                        pathname === it.path ||
                        (it.path !== m.path && pathname.startsWith(it.path + "/"));
                      return (
                        <SubLink
                          key={it.label}
                          href={it.path}
                          $active={subActive}
                        >
                          <Bullet />
                          {it.label}
                        </SubLink>
                      );
                    })}
                  </Sub>
                )}
              </div>
            );
          })}
        </Nav>

        <SideFoot>
          <form action={federatedSignOut}>
            <SignOut type="submit">
              <Icon name="logout" size={16} />
              {!collapsed && <span>Sign out</span>}
            </SignOut>
          </form>
        </SideFoot>
      </Side>

      <Main>
        <TopBar>
          <Collapse onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
            <Icon name={collapsed ? "chevronDown" : "chevronLeft"} size={16} />
          </Collapse>
          <Crumb>
            <strong>{title}</strong>
            <span>›</span>
            <em>Dashboard</em>
            <p>INSA Enterprise Resource Planning System</p>
          </Crumb>
          <Search>
            <input placeholder="Search…" />
          </Search>
          <Bell>
            <Icon name="bell" size={19} />
            <span className="dot">5</span>
          </Bell>
          <UserBadge title={userName}>{userName.charAt(0).toUpperCase()}</UserBadge>
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

const Side = styled.aside<{ $collapsed: boolean }>`
  width: ${(p) => (p.$collapsed ? "74px" : "264px")};
  flex: none;
  background: ${theme.navy};
  color: #c9d2e3;
  display: flex;
  flex-direction: column;
  transition: width 0.18s;
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
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      box-shadow: inset 3px 0 0 ${theme.red2};
    `}
`;
const NavLink = styled(Link)<{ $active?: boolean }>`
  ${navItem}
`;
const NavButton = styled.button<{ $active?: boolean }>`
  ${navItem}
`;

const Chev = styled(Icon)<{ $open?: boolean }>`
  margin-left: auto;
  transition: transform 0.15s;
  transform: rotate(${(p) => (p.$open ? "180deg" : "0deg")});
`;

const Sub = styled.div`
  margin: 0.15rem 0 0.4rem 0.9rem;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding-left: 0.4rem;
`;

const SubLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  color: #aab4d0;
  font-size: 0.88rem;
  border-radius: 7px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }
  ${(p) =>
    p.$active &&
    css`
      background: linear-gradient(90deg, ${theme.red}, ${theme.red2});
      color: #fff;
      font-weight: 600;
    `}
`;

const Bullet = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
  opacity: 0.7;
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

const Collapse = styled.button`
  border: 1px solid #e2e6ee;
  background: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  color: ${theme.navy};
  flex: none;
  display: grid;
  place-items: center;
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
  em {
    color: ${theme.red2};
    font-style: normal;
    font-weight: 600;
  }
  p {
    margin: 0;
    color: #97a0b5;
    font-size: 0.78rem;
  }
`;

const Search = styled.div`
  margin-left: auto;

  input {
    width: 320px;
    max-width: 34vw;
    border: 1px solid #e4e8f0;
    background: #f6f7fb;
    border-radius: 9px;
    padding: 0.55rem 0.9rem;
    outline: none;
    font-size: 0.9rem;
  }
`;

const Bell = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #475569;
  cursor: pointer;

  .dot {
    position: absolute;
    top: -6px;
    right: -8px;
    background: ${theme.red2};
    color: #fff;
    font-size: 0.65rem;
    min-width: 16px;
    height: 16px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    padding: 0 3px;
  }
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

const Content = styled.main`
  padding: 1.5rem;
  overflow-y: auto;
`;
