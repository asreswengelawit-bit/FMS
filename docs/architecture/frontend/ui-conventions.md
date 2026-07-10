# UI Conventions

Shared conventions so all five modules look and behave the same.

## Feature folder layout (every module)
```
features/<module>/
  api/        one file per resource: getEmployees(), createEmployee() — call /api/v1 via shared http-client
  hooks/      react-query: useEmployees(), useCreateEmployee()
  schemas/    zod schemas; export inferred types (z.infer)
  types/      hand-written types not derived from a schema
  components/ module tables, forms, dashboards
  utils/      module helpers
  config/     module constants
```

## Naming
- Components: `PascalCase.tsx` (`EmployeeTable.tsx`, `LeaveRequestForm.tsx`).
- Hooks: `useThing.ts`. API functions: `verbNoun` (`getEmployees`, `approveLeaveRequest`).
- Route folders: kebab-case plural (`purchase-orders`). Files: `page.tsx`, `[id]/page.tsx`, `new/page.tsx`.
- Zod schemas: `employeeSchema`, `createEmployeeSchema`.

## Data fetching
- All server data through **react-query** hooks in `hooks/`. No `fetch` in components.
- API functions live in `api/` and use the shared `http-client` (base URL, auth header, error envelope handling).
- Query keys are namespaced by module: `['hrm','employees', params]`.

## Forms & validation
- **react-hook-form + zod**. The zod schema is the single source of truth for both validation and the TS type.
- Show field errors inline via the shared `Form` components. Map backend validation errors (from the error envelope) back onto fields.

## API response shape (from the backend)
Success `{ success, message, data, timestamp }`; error `{ success:false, message, errors:[{field,message}], timestamp }`.
The http-client unwraps `data` on success and throws a typed error carrying `errors` on failure. See
[shared-dtos](../../../shared-contracts/api/shared-dtos.md).

## Permissions in the UI
- Menus and action buttons are permission-aware — read the current user's permissions and hide/disable what they can't do.
- Permission strings match the backend: `<module>.<entity>.<action>` (e.g. `fms.journal.post`).

## Tables, status, dates
- Use the shared `DataTable` for lists; `StatusBadge` for statuses (consistent color map).
- Format dates/money with shared utilities; money always shows its currency.

## Accessibility & UX
- Every interactive control is keyboard-reachable and labeled.
- Every list has explicit loading, empty, and error states.
