# Frontend Route Ownership

All module routes live under `frontend/src/app/(dashboard)/<module>/`. A team owns only its module's
routes; never add a page under another module's folder.

| Team | Module | Routes (`app/(dashboard)/<module>/`) |
|------|--------|--------------------------------------|
| Team 1 | HRM | `employees/` (+ `new/`, `[id]/`), `departments/`, `attendance/`, `leave-requests/` |
| Team 2 | PRMS | `suppliers/`, `purchase-requests/`, `purchase-orders/` |
| Team 3 | MMS | `items/`, `warehouses/`, `stock-movements/`, `goods-receipts/` |
| Team 4 | CRM | `customers/`, `leads/`, `quotations/`, `sales-orders/` |
| Team 5 | FMS | `chart-of-accounts/`, `journals/`, `invoices/`, `payments/`, `reports/` |

Shared routes (not module-owned): `app/(dashboard)/layout.tsx` (shell + sidebar),
`app/(dashboard)/page.tsx` (dashboard home), `app/login/`, `app/unauthorized/`. These are reviewed
shared files.

## Rules
- Route segment names are **kebab-case plural** (`purchase-orders`, `sales-orders`).
- Each route folder holds a `page.tsx`; detail pages use `[id]/page.tsx`; create pages use `new/page.tsx`.
- Pages stay thin — they compose components and hooks from `features/<module>/`. No data-fetching logic in the route file.
- Register the module's sidebar links in `features/shared/config/navigation/<module>-nav.ts`, not in `layout.tsx`.
