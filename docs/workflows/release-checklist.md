# Release Checklist

## Definition of Done (per feature)
A feature is **Done** only when:
- [ ] Backend endpoint(s) implemented
- [ ] Validation added
- [ ] DB migration added if schema changed
- [ ] Frontend integration completed (if applicable)
- [ ] Permissions enforced
- [ ] Tests written
- [ ] Swagger/OpenAPI docs updated
- [ ] Event publication/consumption added if required
- [ ] PR reviewed (not self-merged)
- [ ] Merged into `develop` without breaking other modules

## Merge gate (PR → develop)
- [ ] Code review complete
- [ ] Module CI green (build + tests) — `.github/workflows/<module>-ci.yml`
- [ ] No shared contract broken (OpenAPI / events / shared DTOs)
- [ ] Docs updated if any contract changed
- [ ] Branch synced with latest `develop`

## Release gate (develop → main)
Run at a demo/release checkpoint.
- [ ] All targeted features merged to `develop` and green
- [ ] `docker compose up` brings up all 5 services + frontend + postgres + rabbitmq
- [ ] Cross-service flows verified end-to-end:
  - [ ] PRMS `PurchaseOrderApproved` → MMS goods receipt → `StockReceived` → PRMS PO closed
  - [ ] CRM `SalesOrderConfirmed` → FMS AR `InvoiceGenerated`
  - [ ] HRM `PayrollProcessed` → FMS expense `JournalPosted`
- [ ] All Flyway migrations apply cleanly on a fresh database
- [ ] Smoke test: login, one create/list flow per module
- [ ] Frontend `npm run build` clean; each backend `./gradlew test` green
- [ ] Tag the release on `main` (e.g. `v0.x-demoN`)

## Weekly demo readiness
Every team shows **running software** each week — a backend endpoint, a frontend flow, an integration
or event flow, or a test-coverage improvement. Slides are not enough.
