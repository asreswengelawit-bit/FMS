// Central design tokens (TypeScript). Imported directly by styled-components.

export const theme = {
  navy: "#0a1f44",
  navy2: "#0d2a5c",
  red: "#b3122b",
  red2: "#c1121f",
  blue: "#1e50c8",
};

export type Tone = "blue" | "green" | "amber" | "red" | "violet" | "slate";

export const toneColor: Record<Tone, string> = {
  blue: "#2563eb",
  green: "#16a34a",
  amber: "#d97706",
  red: "#dc2626",
  violet: "#7c3aed",
  slate: "#475569",
};

export const toneBg: Record<Tone, string> = {
  blue: "#e7efff",
  green: "#e6f7ec",
  amber: "#fdf1de",
  red: "#fdeaea",
  violet: "#f0e9fd",
  slate: "#eef1f6",
};
