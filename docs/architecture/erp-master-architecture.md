# ERP Internship Project — Master Architecture Document

*Enterprise Resource Planning (ERP) System — Engineering Blueprint*

## 1. Purpose
This document defines the architecture, engineering rules, delivery workflow, team responsibilities,
service boundaries, repository structure, and implementation standards for the internship ERP project.
The goal is to let **25 interns in 5 teams** build one ERP system without breaking each other's work,
duplicating logic, or producing incompatible backend/frontend implementations.

**Stack:** Java · Spring Boot · Spring Security · Spring Data JPA · Next.js · React · TypeScript ·
PostgreSQL · RabbitMQ · Docker / Docker Compose. **Style:** domain-based microservices with a shared
frontend, Git + Pull Request workflow.

## 2. Modules
| # | Module | Responsibility |
|---|--------|----------------|
| 1 | **HRM** — Human Resource Management | employees, departments, attendance, leave, payroll HR source data, org structure |
| 2 | **PRMS** — Procurement & Resource Management | suppliers, purchase requests, purchase orders, approvals, procurement workflows |
| 3 | **MMS** — Material Management | item master, warehouses, stock movement, goods receipt/issue, inventory control |
| 4 | **CRM** — Sales & Customer Relationship | customers, leads, quotations, sales orders, customer interactions |
| 5 | **FMS** — Finance Management | chart of accounts, journals, AP/AR, invoices, payments, financial reporting |

## 3. Teams
25 interns, 5 teams of 5. **One team = one module** (primary owner of backend service + frontend feature area).

| Team | Module | Team | Module |
|------|--------|------|--------|
| Team 1 | HRM | Team 4 | CRM |
| Team 2 | PRMS | Team 5 | FMS |
| Team 3 | MMS | | |

### Team internal roles
1. **Team Lead / Coordinator** — planning, task breakdown, PR review coordination, contract discussions, cross-team comms.
2. **Backend Engineer A** — entity modeling, repositories, core CRUD, validation.
3. **Backend Engineer B** — business workflows, event publish/consume, integrations, tests.
4. **Frontend Engineer** — module pages/routes, forms/tables/dashboards, API integration, UI consistency.
5. **QA / Integration Engineer** — testing, Postman/API validation, integration verification, bug reporting, demo support.

Ownership must be explicit — if nobody owns integration, testing, or frontend coordination, those areas get ignored.

## 4. High-Level Architecture
- **1 shared Next.js frontend** — auth pages, dashboard shell, shared nav, module routes for all 5 modules.
- **5 Spring Boot services** — `hrm-service`, `prms-service`, `mms-service`, `crm-service`, `fms-service`.
- **1 PostgreSQL server** — separate schema per service (see [database-strategy](database-strategy.md)).
- **1 RabbitMQ broker** — domain event publishing, cross-service notifications, async integration.
- **Docker Compose** — shared local dev infrastructure.

## 5. Architecture Principles
1. **Domain ownership** — each service owns its entities, business rules, API, schema, events, tests.
2. **Loose coupling** — services never modify each other's tables; integration via REST (`/api/v1/...`) or RabbitMQ only.
3. **Shared frontend, isolated feature ownership** — one Next.js app; each team owns only its feature area.
4. **Contract-first** — endpoint contracts, event payloads, permission naming, and route ownership are agreed before heavy implementation. See [service-boundaries](service-boundaries.md), [event-contracts](event-contracts.md).
5. **Production-style discipline** — validation, security, audit fields, tests, API docs, error handling, migrations.

## 6. Cross-Service Communication
- **Rule 1:** no direct database access across services.
- **Rule 2:** communicate via **REST API** (synchronous, immediate data — e.g. PRMS reads item info from MMS) or **RabbitMQ events** (asynchronous business events — e.g. `PurchaseOrderApproved`, `SalesOrderConfirmed`, `StockReceived`, `InvoiceGenerated`).

Full boundaries in [service-boundaries.md](service-boundaries.md); event catalog in [event-contracts.md](event-contracts.md).

## 7. Security
- **Authentication:** Spring Security + JWT/centralized auth; protected Next.js routes.
- **Authorization:** RBAC + permission-based. Permission naming `<module>.<entity>.<action>` (e.g. `hrm.employee.create`, `prms.purchase_order.approve`, `fms.journal.post`).
- Roles: Super Admin, HR Manager, Procurement Officer, Inventory Manager, Sales Officer, Finance Officer, Auditor, Employee.
- All write endpoints protected; sensitive reads permission-checked; menus permission-aware; actions traceable.

## 8. API Standards
- URL versioning: `/api/v1/...`. Plural resources (`/api/v1/employees`, `/api/v1/purchase-orders`).
- Consistent response envelope for success/error (see [shared-dtos](../../shared-contracts/api/shared-dtos.md)).
- Every service exposes Swagger/OpenAPI. Module contracts in [`docs/architecture/api/`](api/).

## 9. Audit & Operational Standards
- Audit fields on business tables: `created_at`, `created_by`, `updated_at`, `updated_by` (+ `status`/approval fields where relevant).
- Structured logging for requests, validation failures, business actions, integration/event errors.
- Centralized global exception handler (validation, not-found, access-denied, business-rule, unexpected).

## 10. Development Workflow
Branches: `main` (stable) · `develop` (integration) · `feature/*`, `fix/*`, `refactor/*`, `docs/*`.
PRs target `develop`, never `main`. Full rules in [git-strategy](../workflows/git-strategy.md) and
[branching-model](../workflows/branching-model.md). Definition of Done in [release-checklist](../workflows/release-checklist.md).

## 11. Delivery Phases
- **Phase 0** — architecture alignment, team/ownership, module scoping.
- **Phase 1** — domain & contract design (ERDs, API contracts, event contracts, route planning).
- **Phase 2** — shared skeletons (service skeletons, frontend shell, auth, Docker, DB schemas/migrations).
- **Phase 3** — module MVP (entities, workflows, basic pages, CRUD & approval flows).
- **Phase 4** — cross-service integration (RabbitMQ events, service-to-service calls, finance/stock flows).
- **Phase 5** — QA, hardening, demo (bug fixes, testing, docs, deployment readiness).

## 12. Governance
Weekly **team standup** (progress, blockers, contract changes, integration issues), weekly
**architecture sync** (team leads + mentor: cross-team deps, contract changes, shared-frontend conflicts),
weekly **demo** of running software (not slides). Each team runs a board: Backlog → Ready → In Progress
→ PR Review → Blocked → Done, with each card showing owner, module, FE/BE, affected folders, cross-team dependency.

## 13. Non-Negotiable Rules
1. Build freely inside your module boundary; never break another module's contracts.
2. No service writes to another service's schema/tables.
3. Shared frontend changes require careful review.
4. Any API/event contract change is communicated before merging.
5. All schema changes go through Flyway migration files.
6. Critical business actions are permission-aware and traceable.
7. Build incrementally with weekly demos and integration checkpoints.
