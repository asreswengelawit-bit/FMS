"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";

export type PipelineStage = {
  key: string;
  label: string;
  count: number;
  tone: "slate" | "blue" | "pink" | "amber" | "green" | "red";
};

const tones = {
  slate: { bg: "#f1f5f9", fg: "#475569", border: "#cbd5e1" },
  blue: { bg: "#e8efff", fg: "#1d4ed8", border: "#93c5fd" },
  pink: { bg: "#fde8ec", fg: theme.red2, border: "#f5b5c0" },
  amber: { bg: "#fff4e0", fg: "#b45309", border: "#fcd34d" },
  green: { bg: "#e8f8ee", fg: "#15803d", border: "#86efac" },
  red: { bg: "#fee2e2", fg: "#b91c1c", border: "#fca5a5" },
};

export default function CrmPipeline({ stages }: { stages: PipelineStage[] }) {
  return (
    <Wrap>
      <Head>Sales Pipeline</Head>
      <Row>
        {stages.map((s) => {
          const t = tones[s.tone];
          return (
            <Stage key={s.key} style={{ background: t.bg, borderColor: t.border }}>
              <Count style={{ color: t.fg }}>{s.count}</Count>
              <Label style={{ color: t.fg }}>{s.label}</Label>
            </Stage>
          );
        })}
      </Row>
    </Wrap>
  );
}

const Wrap = styled.div`
  background: #fff;
  border: 1px solid #e8ebf1;
  border-radius: 12px;
  padding: 0.9rem 1rem 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
`;

const Head = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 0.65rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.55rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Stage = styled.div`
  border: 1px solid;
  border-radius: 10px;
  padding: 0.7rem 0.6rem;
  text-align: center;
`;

const Count = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
`;

const Label = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 0.15rem;
`;
