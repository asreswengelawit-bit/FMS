# HRM Events

**Producer:** `hrm-service` · Exchange: `hrm.events` (topic). HRM owns these contracts; consumers
review changes. Envelope per [event-contracts](../../docs/architecture/event-contracts.md):
`{ eventId, eventType, occurredAt, source, data }`.

## Published
### `EmployeeCreated`
Routing key: `hrm.employee.created`
```json
{ "employeeId": 1, "employeeNumber": "EMP-0001", "departmentId": 3, "status": "ACTIVE" }
```

### `EmployeeUpdated`
Routing key: `hrm.employee.updated`
```json
{ "employeeId": 1, "changedFields": ["departmentId", "position"] }
```

### `LeaveApproved`
Routing key: `hrm.leave.approved`
```json
{ "leaveRequestId": 55, "employeeId": 1, "type": "ANNUAL", "startDate": "2026-07-20", "endDate": "2026-07-24" }
```

### `PayrollProcessed`
Routing key: `hrm.payroll.processed` — **consumed by FMS** to post a salary-expense journal.
```json
{ "payrollRunId": 9, "period": "2026-07", "totalGross": 480000, "totalDeductions": 60000, "currency": "ETB",
  "lines": [ { "employeeId": 1, "gross": 20000, "deductions": 2500 } ] }
```

## Consumed
None required — HRM is self-contained master data.
