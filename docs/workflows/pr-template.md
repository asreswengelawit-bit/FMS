# Pull Request Rules & Template

## Rules
- Every feature merges via a **pull request into `develop`** (never `main`).
- **Nobody merges their own PR** — at least one review required.
- Keep PRs **small**: one feature / one vertical slice. Good: "Employee CRUD backend", "PRMS supplier table + create form". Bad: "finished hrm", "all backend changes", "refactor everything".
- Any PR touching a **shared file** (see [git-strategy](git-strategy.md) / [frontend-architecture](../architecture/frontend-architecture.md)) must say so, explain why, and be reviewed by a module/project lead.

## Merge requirements
A PR may merge only if: code review complete · build passes · tests pass · it doesn't break shared
contracts · docs updated if contracts changed. Full gate in [release-checklist](release-checklist.md).

## Template
The repo's PR template lives at [`.github/pull_request_template.md`](../../.github/pull_request_template.md)
and is applied automatically on GitHub. It captures:

```
## Module
HRM / PRMS / MMS / CRM / FMS / Frontend-Shared

## Feature
What is implemented?

## Type
feature / fix / refactor / docs

## Changes
- Backend changes: yes/no
- Frontend changes: yes/no
- DB migration included: yes/no
- Event contract changed: yes/no
- Shared file touched: yes/no  (if yes, explain why)

## Testing
How to test (steps) + screenshots if frontend.

## Notes
Known limitations, follow-ups.
```

This alone prevents the "what exactly did this branch do?" conversation.
