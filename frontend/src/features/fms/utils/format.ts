export function formatCurrency(value: number, currency = "USD", locale = "en-US") {
  if (!Number.isFinite(value)) return `${currency} 0.00`;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatPercent(value: number, decimals = 1) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(decimals)}%`;
}
