# Shared Frontend Components

Reusable UI in `frontend/src/features/shared/components/`. These are used by every module — treat them
as a small internal library. **Additive changes only; changing an existing shared component requires
review** (it affects all five modules).

| Component | Path | Purpose |
|-----------|------|---------|
| **DataTable** | `data-table/` | sortable/paginated table with column defs, row actions, empty/loading states |
| **Form** | `form/` | form wrapper integrating react-hook-form + zod, field components, error display |
| **Dialog** | `dialog/` | modal/confirm dialog primitives |
| **StatusBadge** | `status-badge/` | colored badge for statuses (DRAFT/APPROVED/POSTED…) |
| **PageHeader** | `page-header/` | page title, breadcrumbs, primary action slot |
| **Layout** | `layout/` | shell pieces: sidebar, topbar, content container |

## Usage rules
1. **Reuse, don't fork.** Build module UI from these; do not copy a shared component into your feature folder to tweak it.
2. **Need a variant?** First try props/composition. If a genuinely new shared primitive is needed, add a **new** file (new files never conflict) and get it reviewed.
3. **Module-specific** components (an invoice line-item editor, a stock-movement grid) live in `features/<module>/components/`, not here.
4. Keep shared components **presentational** — no module business logic, no direct `/api/v1` calls. Data comes in via props.
5. Status colors and labels come from a shared map so badges are consistent across modules.

## Styling
Follow the tokens/theme in `providers/theme-provider.tsx`. Don't hardcode colors that duplicate design
tokens. See [ui-conventions](ui-conventions.md).
