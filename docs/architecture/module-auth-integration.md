# Adding Authentication to Your Module

**Audience:** every backend team (HRM, PRMS, MMS, CRM, FMS).
**Goal:** turn your Spring Boot service into an **OAuth2 resource server** that trusts JWTs
issued by the shared Keycloak, and protect your endpoints with your module's RBAC
permissions (`<module>.<entity>.<action>`, master-doc §7 / README §7).

You do **not** build login screens or manage passwords — Keycloak does that centrally.
Your service only **validates the token** on each request and checks the caller's roles.

```
User -> logs in at Keycloak -> gets JWT -> frontend calls your API with
        Authorization: Bearer <JWT> -> your service validates it + checks roles
```

> Prerequisite: Keycloak is running (`docker compose up -d`) and the `erp` realm exists.
> Issuer URI = `http://localhost:8080/realms/erp`. Full infra: [keycloak-auth.md](keycloak-auth.md).

Replace `hrm` / `com.company.hrm` with your own module everywhere below.

---

## Step 1 — Add the dependencies (`services/<svc>/build.gradle`)

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
    // ...your existing web / jpa deps
}
```

## Step 2 — Point at Keycloak (`src/main/resources/application.yml`)

Only the `issuer-uri` matters for auth — Spring auto-discovers Keycloak's public keys
(JWKS) from it and validates every token's signature and expiry.

```yaml
spring:
  application:
    name: hrm-service          # your service name
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${KEYCLOAK_ISSUER_URI:http://localhost:8080/realms/erp}

server:
  port: 8081                   # HRM 8081, PRMS 8082, MMS 8083, CRM 8084, FMS 8085
```

> Your datasource / `currentSchema=<module>_schema` config is separate (DB setup) —
> not part of auth.

## Step 3 — Map Keycloak roles to Spring authorities

Keycloak puts a user's realm roles in the token under `realm_access.roles`. This converter
turns each one into a Spring authority **verbatim** (so `hrm_user` and
`hrm.employee.create` both work). Put it in your `shared/security` package.

`src/main/java/com/company/hrm/shared/security/KeycloakRealmRoleConverter.java`
```java
package com.company.hrm.shared.security;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class KeycloakRealmRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    @SuppressWarnings("unchecked")
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Map<String, Object> realmAccess =
                (Map<String, Object>) jwt.getClaims().getOrDefault("realm_access", Map.of());
        Collection<String> roles =
                (Collection<String>) realmAccess.getOrDefault("roles", List.of());

        Set<GrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)   // "hrm_user", "hrm.employee.create", ...
                .collect(Collectors.toSet());

        return new JwtAuthenticationToken(jwt, authorities, jwt.getClaimAsString("preferred_username"));
    }
}
```

## Step 4 — Security config (`shared/security/SecurityConfig.java`)

Locks everything except health/docs, makes the API stateless, and wires the converter.

```java
package com.company.hrm.shared.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity          // turns on @PreAuthorize
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())     // stateless token API, no cookies/CSRF
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/actuator/health/**",
                    "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwtAuthenticationConverter(new KeycloakRealmRoleConverter())));
        return http.build();
    }
}
```

> The converter + config live in **shared backend security** (README §4, high-conflict).
> Agree on one copy per service with your lead; don't let each sub-domain fork it.

## Step 5 — Protect your endpoints with permissions

Use `@PreAuthorize("hasAuthority('<permission>')")` with your RBAC names. **Every write
endpoint must be protected** (README §7); reads at least require a logged-in user.

```java
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    @GetMapping
    @PreAuthorize("hasAuthority('hrm_user')")            // any HRM user may read
    public List<EmployeeDto> list() { ... }

    @PostMapping
    @PreAuthorize("hasAuthority('hrm.employee.create')") // fine-grained permission
    public EmployeeDto create(@RequestBody @Valid CreateEmployeeRequest req) { ... }

    @PostMapping("/{id}/terminate")
    @PreAuthorize("hasAuthority('hrm.employee.terminate')")
    public void terminate(@PathVariable UUID id) { ... }
}
```

Need the caller's identity for audit fields (`created_by` etc.)? Inject it:
```java
@AuthenticationPrincipal Jwt jwt;   // jwt.getClaimAsString("preferred_username")
```

## Step 6 — Register your module's roles/permissions in Keycloak

Your permission names must exist as **realm roles** in Keycloak, or `hasAuthority(...)`
will always deny.

1. Admin console → realm **erp** → **Realm roles** → **Create role**.
2. Name it **exactly** like the permission: `hrm.employee.create`, `hrm.employee.terminate`, …
3. Bundle them: create/edit the composite role **`hrm_user`** → **Associated roles** →
   add the fine-grained `hrm.*` permissions it should grant.
4. Assign `hrm_user` to your users (Users → *user* → Role mapping → Assign role).

**Make it reproducible:** add the same roles to
[`keycloak/realm-export.json`](../../keycloak/realm-export.json) under `roles.realm` so every
teammate gets them on a fresh `docker compose up`. That file is shared — coordinate the
edit with the auth maintainer, same rule as any shared file.

## Step 7 — Test it end-to-end

1. **One-time:** enable password login for local testing — Clients → `erp-frontend` →
   Settings → toggle **Direct access grants** ON → Save. (Frontend proper uses auth-code;
   this is only a convenience for `curl`.)
2. Get a token for a test user:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:8080/realms/erp/protocol/openid-connect/token \
     -d grant_type=password -d client_id=erp-frontend \
     -d username=test.user -d password=YOUR_PASSWORD | jq -r .access_token)
   ```
3. Call your protected endpoint:
   ```bash
   curl http://localhost:8081/api/v1/employees -H "Authorization: Bearer $TOKEN"
   ```
   - Valid token + right role → `200`.
   - No/expired token → `401 Unauthorized`.
   - Logged in but missing the permission → `403 Forbidden`.

Decode the token at https://jwt.io to see the roles under `realm_access.roles`.

---

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `401` with a fresh token | `issuer-uri` mismatch. It must be **exactly** `http://localhost:8080/realms/erp` (the `iss` claim in the token must match). |
| Every request is `403` | The user doesn't have the role, or the role name in Keycloak ≠ the string in `@PreAuthorize`. Decode the token and compare. |
| `hasRole('hrm_user')` never matches | Use **`hasAuthority`**, not `hasRole` — our converter stores roles verbatim (no `ROLE_` prefix). |
| Swagger/health blocked | Add its path to the `permitAll()` list in Step 4. |
| Startup fails contacting Keycloak | Keycloak not up yet, or wrong issuer host. `docker compose ps` → is `erp-keycloak` healthy? |

## Checklist (per module)

- [ ] Resource-server + security deps added
- [ ] `issuer-uri` set in `application.yml`
- [ ] `KeycloakRealmRoleConverter` + `SecurityConfig` in `shared/security`
- [ ] Every write endpoint has `@PreAuthorize("hasAuthority('<module>.<entity>.<action>')")`
- [ ] Module roles created in Keycloak **and** added to `realm-export.json`
- [ ] Verified `200 / 401 / 403` with a test token
