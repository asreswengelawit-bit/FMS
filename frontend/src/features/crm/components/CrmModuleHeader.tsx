"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { CRM_TABS } from "@/features/shared/config/navigation/crm-nav";
import { theme } from "@/styles/theme";

export default function CrmModuleHeader({
  section,
  action,
}: {
  section: string;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Wrap>
      <Top>
        <div>
          <Crumb>
            Sales &amp; Customer Relations <span>›</span> <em>{section}</em>
          </Crumb>
          <Title>Sales &amp; Customer Relationship Management</Title>
          <Tabs>
            {CRM_TABS.map((t) => {
              const active =
                pathname === t.path || pathname.startsWith(t.path + "/");
              return (
                <Tab key={t.path} href={t.path} $active={active}>
                  {t.label}
                </Tab>
              );
            })}
          </Tabs>
        </div>
        {action ? <ActionSlot>{action}</ActionSlot> : null}
      </Top>
    </Wrap>
  );
}

const Wrap = styled.div`
  margin-bottom: 1.25rem;
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const Crumb = styled.p`
  margin: 0 0 0.35rem;
  color: #94a3b8;
  font-size: 0.8rem;

  span {
    margin: 0 0.25rem;
    color: #cbd5e1;
  }
  em {
    font-style: normal;
    color: ${theme.red2};
    font-weight: 600;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.navy};
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
  margin-top: 0.65rem;
`;

const Tab = styled(Link)<{ $active?: boolean }>`
  font-size: 0.9rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) => (p.$active ? theme.navy : "#64748b")};
  border-bottom: 2px solid ${(p) => (p.$active ? theme.red2 : "transparent")};
  padding-bottom: 0.2rem;

  &:hover {
    color: ${theme.navy};
  }
`;

const ActionSlot = styled.div`
  flex: none;
`;
