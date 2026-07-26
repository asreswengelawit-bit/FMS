# Frontend Authentication (Keycloak + Auth.js)

The Next.js app logs users in through Keycloak and routes them to their module
dashboard based on their **realm roles**. No passwords are handled here — Keycloak owns
identity; this app validates the session and enforces role-based access.

## How it works

```
/login  --(Sign in with Keycloak)-->  Keycloak login  -->  back to app with a session
   |                                                             |
   |  middleware.ts guards every route                           |  roles read from the JWT
   v                                                             v
 not logged in -> /login        logged in, wrong role -> /unauthorized        "/" -> your module
```

| File | Role |
|------|------|
| `src/auth.ts` | Auth.js config: Keycloak provider + pulls `realm_access.roles` into the session |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js endpoints (login/callback/logout) |
| `middleware.ts` | Route guard: auth required, role checked per module |
| `src/features/shared/config/roles.ts` | Role → module map (`hrm_user` → `/hrm`, `admin` → all) |
| `src/app/login/page.tsx` | "Sign in with Keycloak" button |
| `src/app/(dashboard)/layout.tsx` | Shell: role-filtered sidebar + sign-out |
| `src/app/(dashboard)/page.tsx` | Redirects each user to their first allowed module |
| `src/app/(dashboard)/<module>/page.tsx` | The role-gated module dashboards |

## One-time setup

1. **Get the client secret from Keycloak.** Console → realm `erp` → Clients →
   `erp-frontend` → **Credentials** tab → copy the **Client secret** (regenerate if it
   still says `replace-me-after-first-import`).
   > If your running Keycloak still has `erp-frontend` as a *public* client (imported
   > before this change), switch it: **Settings → Client authentication → On → Save**,
   > then the Credentials tab appears.

2. **Create the frontend env file:**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```
   Fill in:
   ```
   AUTH_SECRET=<run: npx auth secret   — or: openssl rand -base64 32>
   AUTH_TRUST_HOST=true
   KEYCLOAK_ISSUER=http://localhost:8080/realms/erp
   KEYCLOAK_CLIENT_ID=erp-frontend
   KEYCLOAK_CLIENT_SECRET=<the secret from step 1>
   ```

3. **Install & run:**
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000 — you'll be redirected to `/login`.

## Try it

- Log in as a user with the `hrm_user` role (e.g. the `hrm.user` you created) → you land on
  **/hrm** and the sidebar shows only Human Resources.
- Log in as `erp-admin` (has all roles) → sidebar shows all five modules.
- While logged in as `hrm.user`, manually visit `/fms` → redirected to **/unauthorized**
  (no `fms_user` role).

## Notes

- Keycloak must be running first (`docker compose up -d` in the repo root).
- Roles come from the token's `realm_access.roles`. Assign roles in Keycloak
  (Users → Role mapping) — changes apply on the user's next login.
- The other route files under each module (`hrm/employees`, etc.) are still empty
  scaffolds owned by their teams; only the module landing pages are wired here.
