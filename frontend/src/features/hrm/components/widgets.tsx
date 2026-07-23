// Reusable presentational widgets for the HRM dashboards (dummy data only).

export type Tone = "blue" | "green" | "amber" | "red" | "violet" | "slate";

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
    <div className="hrm-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="hrm-sublinks">{subtitle}</p>}
      </div>
      {action && (
        <button
          className="hrm-add"
          style={action.color ? { background: action.color } : undefined}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export type Kpi = {
  icon: string;
  value: string;
  label: string;
  note: string;
  tone: Tone;
};

export function KpiRow({ items }: { items: Kpi[] }) {
  return (
    <div className="kpi-row" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 6)}, 1fr)` }}>
      {items.map((k) => (
        <div className="kpi-card" key={k.label}>
          <span className={`kpi-icon ${k.tone}`}>{k.icon}</span>
          <strong className="kpi-value">{k.value}</strong>
          <span className="kpi-label">{k.label}</span>
          <span className={`kpi-note ${k.tone}`}>{k.note}</span>
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function PanelRow({ children }: { children: React.ReactNode }) {
  return <div className="panel-row">{children}</div>;
}

export function BarChart({
  data,
  max,
}: {
  data: { label: string; value: number }[];
  max: number;
}) {
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-col" key={d.label}>
          <div
            className="bar"
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="bar-label">{d.label}</span>
        </div>
      ))}
    </div>
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
    <div className="attn">
      {rows.map((a) => (
        <div className="attn-row" key={a.label}>
          <div className="attn-top">
            <span>{a.label}</span>
            <strong className={a.tone}>
              {a.value} / {total}
            </strong>
          </div>
          <div className="attn-track">
            <div
              className={`attn-fill ${a.tone}`}
              style={{ width: `${(a.value / total) * 100}%` }}
            />
          </div>
        </div>
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
    <div className="leave-grid">
      {items.map((l) => (
        <div className="leave-cell" key={l.label}>
          <strong className={l.tone}>{l.value}</strong>
          <span>{l.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ActivityList({
  items,
}: {
  items: { type: string; text: string; date: string }[];
}) {
  return (
    <ul className="activity">
      {items.map((a, i) => (
        <li key={i}>
          <span className="act-dot" />
          <div>
            <div className="act-head">
              <span className="act-type">{a.type}</span>
              <span className="act-date">{a.date}</span>
            </div>
            <p className="act-text">{a.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
