"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";

export type KpiItem = {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "red" | "blue" | "green" | "amber" | "slate";
  iconTone?: "red" | "blue" | "green" | "amber" | "violet" | "slate";
};

const hintColor = {
  red: theme.red2,
  blue: theme.blue,
  green: "#16a34a",
  amber: "#d97706",
  slate: "#64748b",
};

const iconBg = {
  red: "#fde8ec",
  blue: "#e8efff",
  green: "#e8f8ee",
  amber: "#fff4e0",
  violet: "#f1e9ff",
  slate: "#eef2f7",
};

const iconFg = {
  red: theme.red2,
  blue: theme.blue,
  green: "#16a34a",
  amber: "#d97706",
  violet: "#7c3aed",
  slate: "#475569",
};

export default function CrmKpiRow({ items }: { items: KpiItem[] }) {
  return (
    <Row>
      {items.map((item) => (
        <Card key={item.label}>
          <Icon
            style={{
              background: iconBg[item.iconTone ?? "slate"],
              color: iconFg[item.iconTone ?? "slate"],
            }}
          >
            ◆
          </Icon>
          <Meta>
            <Label>{item.label}</Label>
            <Value>{item.value}</Value>
            {item.hint ? (
              <Hint style={{ color: hintColor[item.hintTone ?? "slate"] }}>
                {item.hint}
              </Hint>
            ) : null}
          </Meta>
        </Card>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e8ebf1;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
`;

const Icon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  flex: none;
`;

const Meta = styled.div`
  min-width: 0;
`;

const Label = styled.div`
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
`;

const Value = styled.div`
  color: ${theme.navy};
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.2;
  margin-top: 0.15rem;
`;

const Hint = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.2rem;
`;
