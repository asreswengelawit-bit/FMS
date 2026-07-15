# Authentication & Authorization — Keycloak

Central Identity Provider for INSA-ERP. Keycloak issues OIDC/JWT tokens; the Next.js
frontend logs users in against it, and every Spring Boot service acts as an **OAuth2
resource server** that validates those JWTs. This implements master-doc §7 (Spring
Security + centralized JWT auth, RBAC by `<module>.<entity>.<action>`).

## Topology

```
  Next.js frontend  --(auth-code + PKCE)-->  Keycloak (:8080, realm "erp")
        |                                          ^
        | Bearer <JWT>                             | validates signature via JWKS
        v                                          |
  hrm / prms / mms / crm / fms services  ----------+  (resource servers)
        |
        v
  Neon Postgres (schema per service)     Keycloak -> its own `keycloak` DB on Neon
```

- **Keycloak** runs in Docker Compose and stores its data in a dedicated `keycloak`
  database inside your Neon project (see below).
- **App services** use `DATABASE_URL` (schema-per-service) — unrelated to Keycloak's DB.

## 1. First-time setup

1. In the Neon SQL editor, create Keycloak's database:
   ```sql
   CREATE DATABASE keycloak;
   ```
2. Copy env and fill in real Neon values:
   ```bash
   cp .env.example .env
   # set DATABASE_URL, KC_DB_URL/USERNAME/PASSWORD, KC_BOOTSTRAP_ADMIN_*
   ```
   > `KC_DB_URL` is a **JDBC** URL (`jdbc:postgresql://.../keycloak?sslmode=require`),
   > while `DATABASE_URL` is the standard `postgresql://...` form. Neon requires
   > `?sslmode=require` on both.
3. Start Keycloak (auto-imports the `erp` realm on first boot):
   ```bash
   docker compose up -d
   docker compose logs -f keycloak   # watch for "Imported realm erp"
   ```
4. Open http://localhost:8080/ and log in with `KC_BOOTSTRAP_ADMIN_USERNAME/PASSWORD`.
5. Realm → `erp` → Clients → `erp-backend` → Credentials → **Regenerate secret**, then
   put it in `.env` as `KEYCLOAK_BACKEND_CLIENT_SECRET`.

The import also seeds a sample user `erp-admin` (password `change-me`, must reset on first
login) with all module roles — for local testing only.

## 2. Realm contents (`keycloak/realm-export.json`)

| Client         | Type         | Used by            | Flow                        |
|----------------|--------------|--------------------|-----------------------------|
| `erp-frontend` | public       | Next.js app        | Authorization Code + PKCE   |
| `erp-backend`  | confidential | service-to-service | Client Credentials          |

Realm roles: `admin`, `hrm_user`, `prms_user`, `mms_user`, `crm_user`, `fms_user`.
Fine-grained permissions (`hrm.employee.create`, `fms.journal.post`, …) map onto these
roles/groups — extend the realm export as each module defines its RBAC matrix. Keep the
realm export as the source of truth so auth is reproducible across all 25 interns.

## 3. Wire a Spring Boot service (resource server)

> **Full step-by-step per-module guide:**
> [module-auth-integration.md](module-auth-integration.md) — dependencies, converter,
> security config, `@PreAuthorize`, registering roles, and end-to-end testing. The snippet
> below is the short version.

`build.gradle`:
```gradle
implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
implementation 'org.springframework.boot:spring-boot-starter-security'
```

`application.yml`:
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}          # Neon; append &currentSchema=hrm_schema per service
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${KEYCLOAK_ISSUER_URI:http://localhost:8080/realms/erp}
```

Security config — map Keycloak `realm_access.roles` to Spring authorities and protect
write endpoints (this belongs in **shared security config**, a high-conflict file — review
before editing):
```java
@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .authorizeHttpRequests(a -> a
          .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
          .requestMatchers(HttpMethod.GET, "/api/v1/**").authenticated()
          .anyRequest().authenticated())
      .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(keycloakConverter())))
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    return http.build();
}
```
Then guard actions with `@PreAuthorize("hasRole('hrm_user')")` / permission-based checks.

## 4. Wire the Next.js frontend

Use the `erp-frontend` public client (auth-code + PKCE). Recommended: NextAuth.js with a
Keycloak provider, or `keycloak-js`. Env for the app:
```
NEXT_PUBLIC_KEYCLOAK_ISSUER=http://localhost:8080/realms/erp
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=erp-frontend
```
Attach the access token as `Authorization: Bearer <token>` in the shared
`features/shared/api/http-client.ts`; guard routes in `middleware.ts`.

## 5. Production notes

- Swap `start-dev` for `start` behind HTTPS/a reverse proxy; set `KC_HOSTNAME` to the real
  host and remove `KC_HTTP_ENABLED`.
- Never commit real secrets — `.env` is git-ignored; only `.env.example` is tracked.
- `docker-compose.yml` is a **high-conflict shared/infra file** — changes need lead review.
