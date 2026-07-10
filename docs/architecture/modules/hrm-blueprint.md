# HRM — Human Resource Management Blueprint

> **Owner:** Team 1 · **Service:** `services/hrm-service` · **Schema:** `hrm_schema` · **API:** `/api/v1`
> Read the root [README](../../../README.md) and
> [erp-master-architecture.md](../erp-master-architecture.md) first.
> The `department` sub-domain is the **canonical package layout** for the whole repo.

## 1. Scope (master doc §8.1)
**HRM owns:** employee master data, departments, positions/job titles, attendance, leave requests,
organizational structure, employee status, payroll-related HR source data.
**Must NOT own:** accounting journals, purchase orders, stock balances, customer records.
**May integrate with:** FMS (payroll/salary expense posting), shared auth (user-role mapping).

## 2. Domain Model
| Entity | Key fields |
|--------|-----------|
| **Department** | `code` (unique), name, `managerId` |
| **Employee** | `employeeNumber` (unique), firstName, lastName, email, `departmentId`, position, `hireDate`, status |
| **Attendance** | `employeeId`, date, checkIn, checkOut, status |
| **LeaveRequest** | `employeeId`, type, startDate, endDate, status (PENDING/APPROVED/REJECTED) |
| **PayrollSupport** | `employeeId`, salary components (feeds FMS) |

All business tables include audit fields: `created_at`, `created_by`, `updated_at`, `updated_by`.

## 3. Package Layout (feature-first — the reference)
```
com.company.hrm.<subdomain>/  ← employee · department · attendance · leave · payrollsupport
  controller/ dto/ entity/ repository/ service/ mapper/ event/
com.company.hrm.shared/       ← config · security · exception · audit · util
```

## 4. REST API (`/api/v1`, → `docs/architecture/api/hrm-openapi.yaml`)
| Method | Path | Permission |
|--------|------|-----------|
| GET/POST | `/api/v1/departments` | `hrm.department.read` / `.create` |
| GET/POST | `/api/v1/employees` | `hrm.employee.read` / `.create` |
| GET/PUT | `/api/v1/employees/{id}` | `hrm.employee.read` / `.update` |
| GET/POST | `/api/v1/attendance` | `hrm.attendance.read` / `.create` |
| GET/POST | `/api/v1/leave-requests` | `hrm.leave.read` / `.create` |
| POST | `/api/v1/leave-requests/{id}/approve` | `hrm.leave.approve` |

## 5. Database (Flyway → `hrm-service/.../db/migration/`, schema `hrm_schema`)
Tables: `department`, `employee`, `attendance`, `leave_request`, `payroll_support`.
`V1__init_hrm_schema.sql`, `V2__create_departments.sql`, `V3__create_employees.sql`, …

## 6. Events (`shared-contracts/events/hrm-events.md`)
**Publishes:** `EmployeeCreated`, `EmployeeUpdated`, `LeaveApproved`, `PayrollProcessed`.
**Consumes:** none required (self-contained master data).
Payload envelope: `eventId`, `eventType`, `occurredAt`, `source: "hrm-service"`, `data`.

## 7. Frontend (`features/hrm/`, routes `app/(dashboard)/hrm/`)
Pages: `departments`, `employees` (+ `[id]`, `new`), `attendance`, `leave-requests`.
Layer per page: `api/` → `hooks/` → `schemas/` (zod) → `components/` → route page. Register nav in
`features/shared/config/navigation/hrm-nav.ts`. Reuse `features/shared/` components.

## 8. Integration
**→ FMS:** `PayrollProcessed` becomes a salary-expense journal. All cross-module data via events or
`/api/v1` REST — never another service's DB.

## 9. Task Backlog
1. Department CRUD (build the reference package fully — other teams copy it).
2. Employee CRUD + department link + detail/new pages.
3. Attendance recording.
4. Leave request + approval flow (`LeaveApproved`).
5. Payroll support data + `PayrollProcessed` event.
