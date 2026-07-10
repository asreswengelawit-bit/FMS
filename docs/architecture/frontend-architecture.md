# Frontend Architecture

One shared Next.js app, organized so five teams work in parallel safely.

## Goals
One consistent ERP UI · one login/auth flow · one dashboard shell · module isolation by feature
folder · minimal merge conflicts · clear ownership boundaries.

## Three layers
### A. Shared platform layer (`features/shared/`, `providers/`, `middleware.ts`)
Global infrastructure: auth handling, route protection, shared layout, sidebar/navigation, shared API
client, permission utilities, global error handling. **High-conflict — review required.**

### B. Shared component library (`features/shared/components/`)
Reusable UI: `data-table/`, `form/`, `dialog/`, `status-badge/`, `page-header/`, `layout/`. See
[shared-components](frontend/shared-components.md). Additive changes only; add a new component rather
than editing a shared one. **Review required.**

### C. Module feature areas (`features/<module>/`)
Each team owns its module folder and its routes. Standard internal shape:
```
features/<module>/
  api/        fetchers calling /api/v1/... via the shared http-client
  hooks/      react-query hooks
  schemas/    zod schemas (validation + inferred types)
  types/      module TypeScript types
  components/ module-specific tables, forms, dashboards
  utils/      module helpers
  config/     module config
```

## Ownership
- **Shared (review required):** app shell / `layout.tsx`, sidebar nav config, auth middleware, shared UI library, API client, route guards, permission utilities, theme/design tokens, global state.
- **Team-owned:** `features/<module>/` and `app/(dashboard)/<module>/`. A PR from one team touching another team's feature folder is a red flag unless explicitly coordinated.

See [route-ownership](frontend/route-ownership.md) and [ui-conventions](frontend/ui-conventions.md).

## Navigation & permissions — split the giant files
Never let all teams edit one `nav-config.ts`. Split per module and merge in one `index.ts`:
```
features/shared/config/navigation/
  hrm-nav.ts  prms-nav.ts  mms-nav.ts  crm-nav.ts  fms-nav.ts  index.ts
```
Each team edits only its `<module>-nav.ts`. Same pattern for permissions and route registration.

## Data & auth flow
`features/shared/api/http-client.ts` centralizes base URL, auth header injection, and error handling.
`features/shared/api/query-client.ts` configures react-query. Auth state via `providers/auth-provider.tsx`;
`middleware.ts` protects `(dashboard)` routes; menus render per permission.
