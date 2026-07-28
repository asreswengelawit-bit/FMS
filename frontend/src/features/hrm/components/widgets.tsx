"use client";

// Reusable presentational widgets for the HRM dashboards (dummy data only).
import styled from "styled-components";
import { Icon, type IconName } from "@/features/shared/components/icons";
import { toneColor, toneBg, type Tone } from "@/styles/theme";

export type { Tone };

export function PageHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; color?: string };
}) {
  return (
    <Head>
      <div>
        <h1>{title}</h1>
        {subtitle && <SubLinks>{subtitle}</SubLinks>}
      </div>
      {action && <AddButton $color={action.color}>{action.label}</AddButton>}
    </Head>
  );
}

export type Kpi = {
  icon: IconName;
  value: string;
  label: string;
  note: string;
  tone: Tone;
};

export function KpiRow({ items }: { items: Kpi[] }) {
  return (
    <KpiGrid $cols={Math.min(items.length, 6)}>
      {items.map((k) => (
        <KpiCard key={k.label}>
          <KpiIcon $tone={k.tone}>
            <Icon name={k.icon} size={20} />
          </KpiIcon>
          <KpiValue>{k.value}</KpiValue>
          <KpiLabel>{k.label}</KpiLabel>
          <KpiNote $tone={k.tone}>{k.note}</KpiNote>
        </KpiCard>
      ))}
    </KpiGrid>
  );
}

export function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: IconName;
  children: React.ReactNode;
}) {
  return (
    <PanelBox>
      <PanelTitle>
        {icon && <Icon name={icon} size={18} />}
        {title}
      </PanelTitle>
      {children}
    </PanelBox>
  );
}

export function PanelRow({ children }: { children: React.ReactNode }) {
  return <PanelGrid>{children}</PanelGrid>;
}

export function BarChart({
  data,
  max,
}: {
  data: { label: string; value: number }[];
  max: number;
}) {
  return (
    <Bars>
      {data.map((d) => (
        <BarCol key={d.label}>
          <Bar style={{ height: `${(d.value / max) * 100}%` }} title={`${d.label}: ${d.value}`} />
          <BarLabel>{d.label}</BarLabel>
        </BarCol>
      ))}
    </Bars>
  );
}

export function ProgressList({
  rows,
  total,
}: {
  rows: { label: string; value: number; tone: Tone }[];
  total: number;
}) {
  return (
    <div>
      {rows.map((a) => (
        <AttnRow key={a.label}>
          <AttnTop>
            <span>{a.label}</span>
            <strong style={{ color: toneColor[a.tone] }}>
              {a.value} / {total}
            </strong>
          </AttnTop>
          <AttnTrack>
            <AttnFill $tone={a.tone} style={{ width: `${(a.value / total) * 100}%` }} />
          </AttnTrack>
        </AttnRow>
      ))}
    </div>
  );
}

export function StatGrid({
  items,
}: {
  items: { label: string; value: number | string; tone: Tone }[];
}) {
  return (
    <LeaveGrid>
      {items.map((l) => (
        <LeaveCell key={l.label}>
          <strong style={{ color: toneColor[l.tone] }}>{l.value}</strong>
          <span>{l.label}</span>
        </LeaveCell>
      ))}
    </LeaveGrid>
  );
}

export function ActivityList({
  items,
}: {
  items: { type: string; text: string; date: string }[];
}) {
  return (
    <ActivityUl>
      {items.map((a, i) => (
        <li key={i}>
          <ActDot />
          <div>
            <ActHead>
              <span className="type">{a.type}</span>
              <span className="date">{a.date}</span>
            </ActHead>
            <ActText>{a.text}</ActText>
          </div>
        </li>
      ))}
    </ActivityUl>
  );
}

/* ------------------------------- styles ------------------------------- */
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;

  h1 {
    margin: 0 0 0.3rem;
    font-size: 1.6rem;
    color: #16233f;
  }
`;
const SubLinks = styled.p`
  margin: 0;
  color: #8a93a8;
  font-size: 0.85rem;
`;
const AddButton = styled.button<{ $color?: string }>`
  background: ${(p) => p.$color ?? "#2563eb"};
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 0.7rem 1.1rem;
  font-weight: 600;
  cursor: pointer;
  flex: none;

  &:hover {
    filter: brightness(0.95);
  }
`;

const KpiGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols}, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const KpiCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  box-shadow: 0 4px 16px rgba(16, 31, 68, 0.05);
`;
const KpiIcon = styled.span<{ $tone: Tone }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  margin-bottom: 0.4rem;
  color: ${(p) => toneColor[p.$tone]};
  background: ${(p) => toneBg[p.$tone]};
`;
const KpiValue = styled.strong`
  font-size: 1.9rem;
  font-weight: 800;
  color: #16233f;
  line-height: 1;
`;
const KpiLabel = styled.span`
  color: #6b7488;
  font-size: 0.82rem;
`;
const KpiNote = styled.span<{ $tone: Tone }>`
  font-size: 0.76rem;
  font-weight: 600;
  color: ${(p) => toneColor[p.$tone]};
`;

const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
const PanelBox = styled.section`
  background: #fff;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(16, 31, 68, 0.05);
`;
const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.1rem;
  font-size: 1rem;
  color: #16233f;

  svg {
    color: #64748b;
  }
`;

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 240px;
  padding-top: 0.5rem;
`;
const BarCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 0.5rem;
`;
const Bar = styled.div`
  width: 60%;
  min-height: 4px;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  border-radius: 5px 5px 0 0;
`;
const BarLabel = styled.span`
  font-size: 0.72rem;
  color: #8a93a8;
`;

const AttnRow = styled.div`
  margin-bottom: 1rem;
`;
const AttnTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
  color: #4b5568;
`;
const AttnTrack = styled.div`
  height: 8px;
  background: #eef1f6;
  border-radius: 999px;
  overflow: hidden;
`;
const AttnFill = styled.div<{ $tone: Tone }>`
  height: 100%;
  border-radius: 999px;
  background: ${(p) => toneColor[p.$tone]};
`;

const LeaveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
`;
const LeaveCell = styled.div`
  background: #f7f8fb;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    font-size: 1.6rem;
    font-weight: 800;
  }
  span {
    color: #8a93a8;
    font-size: 0.82rem;
  }
`;

const ActivityUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    gap: 0.7rem;
    padding: 0.7rem 0;
    border-bottom: 1px solid #f0f2f6;
  }
  li:last-child {
    border-bottom: none;
  }
`;
const ActDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #16a34a;
  margin-top: 6px;
  flex: none;
`;
const ActHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  .type {
    color: #16a34a;
    font-weight: 700;
    font-size: 0.9rem;
  }
  .date {
    color: #a2aabb;
    font-size: 0.78rem;
  }
`;
const ActText = styled.p`
  margin: 0.15rem 0 0;
  color: #5b6377;
  font-size: 0.85rem;
`;
