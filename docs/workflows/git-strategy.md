# Git Strategy

How five teams share one monorepo without turning Git into a civil war.

## Branching model
Long-lived:
- `main` — stable, demo-ready.
- `develop` — integration branch for all completed features.

Short-lived (one per task):
```
feature/<module>-<feature-name>    feature/hrm-employee-crud
fix/<module>-<issue-name>          fix/hrm-attendance-validation
refactor/<scope>-<name>            refactor/frontend-shared-table
docs/<topic>                       docs/event-contracts
```
See [branching-model](branching-model.md) for naming details.

## Mandatory workflow
```bash
# 1. latest integration branch
git checkout develop && git pull origin develop
# 2. fresh feature branch from develop
git checkout -b feature/hrm-employee-crud
# 3. work ONLY on your assigned files (no "clean up unrelated code" in the same PR)
# 4. small, meaningful commits
git commit -m "feat(hrm): add employee create endpoint"
git commit -m "feat(hrm): add employee list page"
# 5. sync before pushing
git checkout develop && git pull origin develop
git checkout feature/hrm-employee-crud && git merge develop
# 6. push and open a PR into develop (never main)
git push origin feature/hrm-employee-crud
```

## Reducing conflicts before they happen
- **Rule 1 — strict file ownership.** Each team owns a module; each member owns specific sub-domains (e.g. HRM: employee / department / attendance / leave / frontend). If two people edit the same file daily, the task split is wrong.
- **Rule 2 — one owner for shared shell.** `layout.tsx`, nav config, auth provider, sidebar, shared table/form components change through 1–2 designated maintainers, not all 25 people.
- **Rule 3 — avoid giant files.** Split conflict magnets (nav config, permissions, route registration, API config) into per-module files merged by an `index.ts`.
- **Rule 4 — small PRs.** One feature / one vertical slice, not "I touched 97 files."
- **Rule 5 — sync frequently.** Merge `develop` daily; a branch untouched for 10 days is a conflict bomb. For interns, `merge` from `develop` is safer than forced `rebase`.

## Conflict resolution
```bash
git checkout develop && git pull origin develop
git checkout feature/hrm-employee-crud && git merge develop
```
Open conflicted files, understand what changed on **both** sides (don't blindly delete markers), keep
the correct combination, then verify: frontend `npm run lint && npm run build`, backend `./gradlew test`.
Commit the resolution:
```bash
git commit -m "merge develop into feature/hrm-employee-crud and resolve conflicts"
```

## Repository rules
1. Nobody pushes directly to `main`.
2. Nobody merges their own PR without review.
3. Every task has a branch.
4. Every PR targets `develop`.
5. Every team syncs with `develop` frequently.
6. Every shared-file change is explicitly called out.
7. If two people need the same file, stop and redesign ownership before coding.
8. Don't mix unrelated changes in one branch.
9. Don't rename/move huge folders mid-project unless planned.
10. Finish and merge one branch before starting five half-dead ones.

See [pr-template](pr-template.md) and [release-checklist](release-checklist.md).
