# Branching Model

## Long-lived branches
- **`main`** — stable, demo-ready. Protected. Only release merges from `develop`. No direct pushes.
- **`develop`** — integration branch for completed features. Protected. All feature PRs merge here.

## Short-lived branches (one per task)
| Prefix | Format | Example |
|--------|--------|---------|
| `feature/` | `feature/<module>-<feature-name>` | `feature/prms-supplier-crud` |
| `fix/` | `fix/<module>-<issue-name>` | `fix/mms-stock-negative-guard` |
| `refactor/` | `refactor/<scope>-<name>` | `refactor/frontend-shared-table` |
| `docs/` | `docs/<topic>` | `docs/event-contracts` |

`<module>` is one of `hrm`, `prms`, `mms`, `crm`, `fms` (or `frontend` for shared FE work).

### Examples
```
feature/hrm-department-management
feature/hrm-employee-crud
feature/prms-purchase-order
feature/mms-goods-receipt
feature/crm-sales-order-page
feature/fms-journal-posting
fix/hrm-attendance-validation
fix/frontend-nav-permissions
docs/service-boundaries
```

## Flow
```
feature/* ── PR ──▶ develop ── release ──▶ main
```
- Branch from `develop`, PR back into `develop`.
- `develop → main` happens at a release/demo checkpoint after QA (see [release-checklist](release-checklist.md)).
- Delete the feature branch after merge. One task = one branch = one PR.

## Rules
- Never commit to `main` or `develop` directly.
- Never force-push a shared branch.
- Rebase/merge `develop` into your branch **daily** to keep conflicts small.
