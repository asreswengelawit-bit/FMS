# INSA-ERP

An Enterprise Resource Planning system built as **5 domain-aligned microservices** (Spring Boot,
Spring Security, Spring Data JPA) with a single shared **Next.js** frontend, **one PostgreSQL server
with a separate schema per service**, and **RabbitMQ** for event-driven integration. Containerized
with Docker Compose.

> This README is the quick operating guide. The authoritative specs live in
> [`docs/architecture/erp-master-architecture.md`](docs/architecture/erp-master-architecture.md) and
> [`docs/workflows/git-strategy.md`](docs/workflows/git-strategy.md). Module designs are in
> [`docs/architecture/modules/`](docs/architecture/modules/).

---

## 1. Modules & Team Ownership

There are **25 interns in 5 teams**. **One team owns exactly one module** and is the primary owner of
its backend service and its frontend feature area.

| Team | Module | Domain | Backend (owned) | Frontend (owned) | DB schema |
|------|--------|--------|-----------------|------------------|-----------|
| **Team 1** | **HRM**  | Human Resources       | `services/hrm-service/`  | `features/hrm/`, `app/(dashboard)/hrm/`   | `hrm_schema` |
| **Team 2** | **PRMS** | Procurement           | `services/prms-service/` | `features/prms/`, `app/(dashboard)/prms/` | `prms_schema` |
| **Team 3** | **MMS**  | Materials / Inventory | `services/mms-service/`  | `features/mms/`, `app/(dashboard)/mms/`   | `mms_schema` |
| **Team 4** | **CRM**  | Sales / Customers     | `services/crm-service/`  | `features/crm/`, `app/(dashboard)/crm/`   | `crm_schema` |
| **Team 5** | **FMS**  | Finance / Accounting  | `services/fms-service/`  | `features/fms/`, `app/(dashboard)/fms/`   | `fms_schema` |

Each team also **exclusively owns**: `docs/architecture/modules/<module>-blueprint.md`,
`docs/architecture/api/<module>-openapi.yaml`, `shared-contracts/events/<module>-events.md`,
and `.github/workflows/<module>-ci.yml`.

### Team internal roles (5 members)
Team Lead / Coordinator · Backend Engineer A (entities, repositories, CRUD, validation) ·
Backend Engineer B (workflows, events, integration, tests) · Frontend Engineer (pages, forms, API
hooks) · QA / Integration Engineer. **Split sub-domains between members** so two people never edit
the same file daily — e.g. inside HRM: `employee/`, `department/`, `attendance/`, `leave/`, frontend.

---

## 2. The Golden Rules (Final Engineering Rules, from the master doc)

1. A team builds freely **inside its module boundary** but must never break another module's contracts.
2. **No service writes to another service's schema/tables.** Cross-service = **REST (`/api/v1/...`) or
   RabbitMQ events** only.
3. **Shared frontend changes** (app shell, nav, middleware, shared UI) require careful review.
4. Any **API/event contract change** must be communicated to consumers before merging.
5. **All schema changes go through Flyway migration files** — never manual edits.
6. Critical business actions must be **permission-aware and traceable** (audit fields).
7. Build incrementally: small PRs, **daily sync with `develop`**, weekly demos.

---

## 3. Branching Model

Long-lived: `main` (stable, demo-ready) · `develop` (integration branch for completed features).
**All feature PRs target `develop`, never `main`.**

```
feature/<module>-<feature-name>    feature/hrm-employee-crud
fix/<module>-<issue-name>          fix/mms-stock-negative-guard
refactor/<scope>-<name>            refactor/frontend-shared-table
docs/<topic>                       docs/event-contracts
```

### Mandatory workflow (every task)
```bash
git checkout develop && git pull origin develop     # 1. latest integration branch
git checkout -b feature/hrm-employee-crud            # 2. fresh branch from develop
# 3. work ONLY on your assigned files (no drive-by cleanups)
git commit -m "feat(hrm): add employee create endpoint"   # 4. small, meaningful commits
git checkout develop && git pull origin develop           # 5. sync before pushing
git checkout feature/hrm-employee-crud && git merge develop
git push origin feature/hrm-employee-crud            # 6. open PR into develop (not main)
```
Sync with `develop` **daily**. A branch untouched by `develop` for 10 days is a conflict bomb.

---

## 4. High-Conflict Shared Files — edit only with review

**Frontend:** `src/app/(dashboard)/layout.tsx` · `features/shared/config/nav-config.ts` ·
`features/shared/config/permissions.ts` · `features/shared/api/http-client.ts` · `middleware.ts` ·
`features/shared/components/**` · `src/providers/**`

**Backend:** root `application.yml` · shared security config · RabbitMQ exchange/queue config ·
global exception classes · common enum files.

**Root/infra:** `docker-compose.yml` · `Makefile` · `package.json` · `infrastructure/**`

Rule: any PR touching these must call it out in the PR description, explain why, and be reviewed by a
module lead or project lead. Assign **1–2 maintainers** for shared frontend infrastructure.

### Beat the nav/permissions collision — split the giant files
Instead of one giant `nav-config.ts` everyone edits, split per module and merge in one `index.ts`:
```
features/shared/config/navigation/
  hrm-nav.ts  prms-nav.ts  mms-nav.ts  crm-nav.ts  fms-nav.ts  index.ts
```
Each team edits only its `<module>-nav.ts`. Same trick for permissions and route registration.

---

## 5. Database — schema-per-service + Flyway

One PostgreSQL server, one schema per service (`hrm_schema`, `prms_schema`, `mms_schema`,
`crm_schema`, `fms_schema`). Each team owns only its schema, tables, migrations, and seed data.

Migrations are versioned Flyway scripts in `services/<svc>/src/main/resources/db/migration/`:
```
V1__init_hrm_schema.sql   V2__create_departments.sql   V3__create_employees.sql
```
**Within a team, coordinate the next version number** (assign ranges per sub-domain, e.g. employee
V10–V19, attendance V20–V29) so two members don't both create `V4`. Migrations are **immutable once
merged** — fix forward with a new version.

---

## 6. Contracts — API & Events

**REST (`docs/architecture/api/<module>-openapi.yaml`):** endpoints use `/api/v1/<plural-resource>`
(`GET /api/v1/employees`, `POST /api/v1/purchase-orders`). Every service exposes Swagger/OpenAPI.
Consistent response envelope:
```json
{ "success": true, "message": "...", "data": { }, "timestamp": "2026-07-08T12:00:00Z" }
```

**Events (`shared-contracts/events/<module>-events.md`):** PascalCase, past-tense business names
(`PurchaseOrderApproved`, `StockReceived`, `SalesOrderConfirmed`, `InvoiceGenerated`). Payload:
```json
{ "eventId": "uuid", "eventType": "PurchaseOrderApproved", "occurredAt": "...",
  "source": "prms-service", "data": { } }
```
The **producing service owns** the event contract; **consumers review** before changes merge.
Contracts are additive; breaking changes need consumer sign-off and a deprecation window.

---

## 7. Engineering standards (every module)

- **Audit fields** on business tables: `created_at`, `created_by`, `updated_at`, `updated_by`
  (+ `status` / approval fields where relevant).
- **RBAC permissions** named `<module>.<entity>.<action>` (`hrm.employee.create`,
  `prms.purchase_order.approve`, `fms.journal.post`). Write endpoints protected; menus permission-aware.
- **Global exception handler**, structured logging, validation on all inputs.

---

## 8. Definition of Done (master doc §19)

- [ ] Backend endpoint(s) implemented with validation
- [ ] Flyway migration added if schema changed
- [ ] Frontend integration done (if applicable)
- [ ] Permissions enforced
- [ ] Tests written; build + tests green in module CI
- [ ] Swagger docs updated; event publish/consume added if required
- [ ] Only your owned files changed; no shared file touched without review
- [ ] Branch synced with `develop`; PR uses the template and targets `develop`
- [ ] PR reviewed (nobody merges their own) — merged without breaking other modules

---

## 9. Getting started

```bash
git init && git add . && git commit -m "chore: project scaffold + docs"
git branch -M main
git checkout -b develop        # long-lived integration branch
# push both, protect main + develop, then each team branches per §3
```
Then **read your module blueprint** in `docs/architecture/modules/` and build within your tree.
Delivery is phased: Phase 0 alignment → 1 contracts → 2 skeletons → 3 module MVP → 4 integration →
5 QA/demo.
