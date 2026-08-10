# hrm-service

Human Resource Management — **Team 1**. Owns the `hrm_schema` schema and everything under
`/api/v1` listed below. Read the root [README](../../README.md) and the
[HRM blueprint](../../docs/architecture/modules/hrm-blueprint.md) first.

Spring Boot 4.1 · Java 21 · Maven · PostgreSQL + Flyway · Keycloak (OAuth2 resource server).

---

## Run it

```bash
# from the repo root: Keycloak must be up for tokens to validate
docker compose up -d

cd services/hrm-service
./mvnw spring-boot:run
```

Configuration comes from the repo-root `.env` (auto-imported):

| Variable | Default | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | — | libpq-style URL (`postgresql://user:pass@host/db?sslmode=require`). Converted to `spring.datasource.*` and pinned to `currentSchema=hrm_schema`. |
| `KEYCLOAK_ISSUER_URI` | `http://localhost:8080/realms/erp` | Token issuer this service validates against. |
| `HRM_SERVICE_PORT` | `8081` | HRM 8081, PRMS 8082, MMS 8083, CRM 8084, FMS 8085. |
| `HRM_SHOW_SQL` / `HRM_LOG_LEVEL` | `false` / `INFO` | Debugging knobs. |

`SPRING_DATASOURCE_URL` still overrides `DATABASE_URL` if you need a one-off database.

- Swagger UI — <http://localhost:8081/swagger-ui.html>
- OpenAPI JSON — <http://localhost:8081/v3/api-docs>
- Health — <http://localhost:8081/actuator/health>

## Test it

```bash
./mvnw verify       # needs Docker: Testcontainers starts Postgres
```

The suite boots the service against a real Postgres, applies every migration and lets
Hibernate validate the mappings against the result — a migration that drifts from an
entity fails the build. It also covers the response envelope, bean validation and the
401/403/2xx behaviour of the permission annotations.

## API

Every endpoint is under `/api/v1` and returns the shared envelope
`{ success, message, data, timestamp }`.

| Sub-domain | Base path |
|-----------|-----------|
| Employees | `/api/v1/employees` |
| Departments | `/api/v1/departments` |
| Organizations · branches · positions · job grades | `/api/v1/organizations`, `/branches`, `/positions`, `/job-grades` |
| Attendance | `/api/v1/attendance` |
| Leave requests | `/api/v1/leave-requests` |
| Payroll source data | `/api/v1/payrolls` |
| Recruitment | `/api/v1/candidates`, `/job-postings`, `/job-applications`, `/interviews` |

## Permissions

Reads need any HRM-scoped authority — a job role (`hrm_admin`, `hrm_employee`, …) or a
fine-grained permission (`hrm.employee.read`). There is no separate `hrm_user` gate role:
the `hrm` prefix already identifies the module, so one assignment both names the job and
opens the module. A role from another module (`crm_admin`) does not grant HRM access.

Writes need the fine-grained permission `hrm.<entity>.<action>` **or** the realm role that
owns the area — `hrm_admin`, `hrm_operations_manager`, `hrm_recruitment_officer`. All of it
lives in one place:
[`shared/security/HrmPermissions`](src/main/java/com/company/hrm/shared/security/HrmPermissions.java).

The realm currently ships only the coarse job roles
([`keycloak/realm-export.json`](../../keycloak/realm-export.json)); create the
`hrm.<entity>.<action>` realm roles when you want finer grants and they start working with
no code change.

Getting a token and checking 200/401/403 by hand:
[module-auth-integration.md](../../docs/architecture/module-auth-integration.md) §7.

## Package layout

```
com.company.hrm.<subdomain>/   employee · department · organization · attendance ·
                              leave · payrollsupport · recruitment · training · separation
  controller/ dto/ entity/ repository/ service/ mapper/
com.company.hrm.shared/       api (response envelope) · audit · config · exception · security
```

`department/` is the reference sub-domain other teams copy (blueprint §3).

## Database

Schema `hrm_schema`, DDL owned entirely by Flyway in
[`src/main/resources/db/migration`](src/main/resources/db/migration) — `ddl-auto` is
`validate`, so Hibernate never changes the schema and a mismatch fails startup.

`V1` … `V11` are the baseline. **Next free version: `V12`.** Migrations are immutable once
merged; fix forward. Coordinate the next number inside the team before you create one.

## Known gaps

Carried over from the original `human-resource` service, not introduced here:

- `POST /api/v1/leave-requests/{id}/approve` (blueprint §4) is not implemented — leave
  requests can be created and listed, but not approved or rejected.
- No events are published yet. `EmployeeCreated`, `EmployeeUpdated`, `LeaveApproved` and
  `PayrollProcessed` are specified in
  [hrm-events.md](../../shared-contracts/events/hrm-events.md) and FMS is waiting on
  `PayrollProcessed`; RabbitMQ is not wired into the stack yet either.
- `DepartmentRequest.managerName` is accepted but ignored — the manager link is not
  resolved to an employee.
- The training and separation sub-domains have entities and tables only; no repositories,
  services or endpoints.
- `Employee` uses `employeeCode`, while the blueprint calls the natural key
  `employeeNumber`. The API keeps `employeeCode`.
