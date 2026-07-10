# Database Strategy

## Model
One PostgreSQL server, **one schema per service** — cheaper than separate DB servers while keeping
clear ownership and migration boundaries.

| Service | Schema |
|---------|--------|
| hrm-service | `hrm_schema` |
| prms-service | `prms_schema` |
| mms-service | `mms_schema` |
| crm-service | `crm_schema` |
| fms-service | `fms_schema` |

Schemas are created at container startup via
[`infrastructure/postgres/init/`](../../infrastructure/postgres/) (`01-create-databases.sql`,
`02-create-schemas.sql`).

## Ownership
Each team owns **only** its schema, tables, migration scripts, and seed data. **No team may modify
another team's schema.** Cross-service data is fetched via REST or events, never by querying another
schema.

## Migrations (Flyway)
- All schema changes are versioned Flyway scripts in `services/<svc>/src/main/resources/db/migration/`.
- Naming: `V<n>__<snake_description>.sql` — e.g. `V1__init_hrm_schema.sql`, `V2__create_departments.sql`, `V3__create_employees.sql`.
- **Immutable once merged** — never edit a merged migration; fix forward with a new version.
- No manual/production-like schema edits; every change is a committed, PR-reviewed migration.

### Avoiding version-number collisions inside a team
Because all of a team's migrations share one folder, two members can both pick `V4`. Prevent it:
- **Reserve version ranges per sub-domain** (e.g. employee `V10–V19`, department `V20–V29`, attendance `V30–V39`), or
- Confirm the next free number in standup before creating a migration.

## Audit fields
Every business table includes: `created_at`, `created_by`, `updated_at`, `updated_by`. Where relevant:
`status`, `approval_status`, `approval_date`, `approved_by`. Prefer JPA auditing
(`@CreatedDate`, `@CreatedBy`, `@LastModifiedDate`, `@LastModifiedBy`) wired in each service's
`shared/audit`.

## Conventions
- `snake_case` table and column names; singular table names (`employee`, `purchase_order`).
- Surrogate `BIGINT` PK `id`; natural keys (`employee_number`, `item_code`) get a unique constraint.
- FKs only **within** a schema. Cross-module references are stored as plain ID values (e.g. MMS stores `purchase_order_id` from PRMS) with **no** database FK across schemas.
- Money as `NUMERIC(19,4)` with an explicit currency column.
