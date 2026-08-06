const statusMap: Record<string, { color: string; bg: string }> = {
  // Generic
  ACTIVE:           { color: "#16A34A", bg: "#F0FDF4" },
  INACTIVE:         { color: "#64748B", bg: "#F1F5F9" },
  PENDING:          { color: "#D97706", bg: "#FFFBEB" },
  APPROVED:         { color: "#16A34A", bg: "#F0FDF4" },
  REJECTED:         { color: "#C8102E", bg: "#FFF1F3" },
  DRAFT:            { color: "#64748B", bg: "#F1F5F9" },
  // HRM
  "On Leave":       { color: "#7C3AED", bg: "#F5F3FF" },
  PRESENT:          { color: "#16A34A", bg: "#F0FDF4" },
  ABSENT:           { color: "#C8102E", bg: "#FFF1F3" },
  LATE:             { color: "#D97706", bg: "#FFFBEB" },
  "HALF DAY":       { color: "#7C3AED", bg: "#F5F3FF" },
  "ON LEAVE":       { color: "#64748B", bg: "#F1F5F9" },
  Paid:             { color: "#16A34A", bg: "#F0FDF4" },
  Processing:       { color: "#D97706", bg: "#FFFBEB" },
  Hold:             { color: "#C8102E", bg: "#FFF1F3" },
  Transfer:         { color: "#2563EB", bg: "#EEF2FF" },
  Promotion:        { color: "#16A34A", bg: "#F0FDF4" },
  Demotion:         { color: "#C8102E", bg: "#FFF1F3" },
  Reassignment:     { color: "#7C3AED", bg: "#F5F3FF" },
  Onboarding:       { color: "#2563EB", bg: "#EEF2FF" },
  Separation:       { color: "#64748B", bg: "#F1F5F9" },
  // PRMS
  Submitted:        { color: "#2563EB", bg: "#EEF2FF" },
  "Under Review":   { color: "#D97706", bg: "#FFFBEB" },
  "Partially Received": { color: "#7C3AED", bg: "#F5F3FF" },
  Received:         { color: "#16A34A", bg: "#F0FDF4" },
  Cancelled:        { color: "#C8102E", bg: "#FFF1F3" },
  Active:           { color: "#16A34A", bg: "#F0FDF4" },
  Expiring:         { color: "#D97706", bg: "#FFFBEB" },
  Expired:          { color: "#C8102E", bg: "#FFF1F3" },
  // MMS
  "In Stock":       { color: "#16A34A", bg: "#F0FDF4" },
  "Low Stock":      { color: "#D97706", bg: "#FFFBEB" },
  "Out of Stock":   { color: "#C8102E", bg: "#FFF1F3" },
  Issued:           { color: "#16A34A", bg: "#F0FDF4" },
  // CRM
  New:              { color: "#2563EB", bg: "#EEF2FF" },
  Qualified:        { color: "#7C3AED", bg: "#F5F3FF" },
  Proposal:         { color: "#D97706", bg: "#FFFBEB" },
  Negotiation:      { color: "#F59E0B", bg: "#FFFBEB" },
  "Closed Won":     { color: "#16A34A", bg: "#F0FDF4" },
  Lost:             { color: "#C8102E", bg: "#FFF1F3" },
  Confirmed:        { color: "#16A34A", bg: "#F0FDF4" },
  Delivered:        { color: "#2563EB", bg: "#EEF2FF" },
  // FMS
  Posted:           { color: "#16A34A", bg: "#F0FDF4" },
  "Partially Paid": { color: "#D97706", bg: "#FFFBEB" },
  "Fully Paid":     { color: "#16A34A", bg: "#F0FDF4" },
  Overdue:          { color: "#C8102E", bg: "#FFF1F3" },
  Completed:        { color: "#16A34A", bg: "#F0FDF4" },
  Failed:           { color: "#C8102E", bg: "#FFF1F3" },
}

export function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] ?? { color: "#64748B", bg: "#F1F5F9" }
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}
    >
      {status}
    </span>
  )
}
