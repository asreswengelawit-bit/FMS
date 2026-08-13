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

## Step 1 — Add the dependencies

Gradle (`services/<svc>/build.gradle`):
```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'
    // ...your existing web / jpa deps
}
```

Maven (`services/<svc>/pom.xml`) — hrm-service uses this:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
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
turns each one into a Spring authority **verbatim** (so `crm_sales_officer` and
`crm.customer.create` both work). Put it in your `shared/security` package.

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
                .map(SimpleGrantedAuthority::new)   // "crm_sales_officer", "crm.customer.create", ...
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

**Every write endpoint must be protected** (README §7); reads require a role belonging to
your module.

There is **no `<module>_user` gate role**. Every role and permission is already named for
its module — `crm_sales_officer`, `fms.invoice.create` — so the prefix identifies the
module and a single assignment both names the job and opens the module. Reads therefore
test the prefix; writes name the exact permission or the role that owns the area.

Keep every expression in one constants class so the rules are reviewable in one place, the
way HRM does in
[`HrmPermissions`](../../services/hrm-service/src/main/java/com/company/hrm/shared/security/HrmPermissions.java).
Replace `crm` with your module:

`src/main/java/com/company/crm/shared/security/CrmPermissions.java`
```java
public final class CrmPermissions {

    /** Any caller holding a CRM-scoped authority, plus the global administrator. */
    public static final String READ = "hasAuthority('admin')"
            + " or authentication.authorities.?[authority.startsWith('crm')].size() > 0";

    private static final String ADMINS = "'crm_admin','admin'";
    private static final String SALES  = "'crm_sales_manager','crm_sales_officer'," + ADMINS;

    public static final String CUSTOMER_CREATE = "hasAnyAuthority('crm.customer.create'," + SALES + ")";
    public static final String CUSTOMER_DELETE = "hasAnyAuthority('crm.customer.delete'," + ADMINS + ")";

    private CrmPermissions() {
    }
}
```

The values are compile-time constants, so they drop straight into annotations:

```java
@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    @GetMapping
    @PreAuthorize(CrmPermissions.READ)              // any CRM role, or admin
    public List<CustomerDto> list() { ... }

    @PostMapping
    @PreAuthorize(CrmPermissions.CUSTOMER_CREATE)   // permission or owning role
    public CustomerDto create(@RequestBody @Valid CreateCustomerRequest req) { ... }
}
```

Two things this buys you, both worth a test: a fine-grained `crm.customer.read` token can
read, and another module's role (`hrm_admin`) is refused. HRM pins both in
[`EndpointAuthorizationTests`](../../services/hrm-service/src/test/java/com/company/hrm/shared/security/EndpointAuthorizationTests.java)
— copy it, because prefix matching is only safe while it stays scoped.

Need the caller's identity for audit fields (`created_by` etc.)? Inject it:
```java
@AuthenticationPrincipal Jwt jwt;   // jwt.getClaimAsString("preferred_username")
```

## Step 6 — The roles your module already has

These exist in the `erp` realm today — nothing to create before you start. Assign one to a
user (Users → *user* → Role mapping) and they can reach your module.

**PRMS**

| Role | Meaning |
|------|---------|
| `prms_procurement_admin` | Procurement Admin - full PRMS administration |
| `prms_requester` | Requester (Employee) - creates purchase requests |
| `prms_supplier` | Supplier - external supplier-facing access |

**MMS**

| Role | Meaning |
|------|---------|
| `mms_user` | MMS module access - read basic MMS information |
| `mms_inventory_manager` | read, create, update, approve, export |
| `mms_store_keeper` | read, create, update, export |
| `mms_viewer` | read only |

**CRM**

| Role | Meaning |
|------|---------|
| `crm_admin` | System Administrator (RADMIN) - full CRM administration |
| `crm_sales_manager` | oversees the sales pipeline and approvals |
| `crm_sales_officer` | daily leads, quotations and sales orders |
| `crm_finance_officer` | customer credit, invoicing and collections |
| `crm_auditor` | read-only access for review and audit |

**FMS**

| Role | Meaning |
|------|---------|
| `fms_finance_administrator` | full FMS administration |
| `fms_finance_manager` | approves and oversees financial operations |
| `fms_general_accountant` | journals, ledger and period close |
| `fms_ap_officer` | supplier invoices and payments |
| `fms_ar_officer` | customer invoices and receipts |

`admin` grants every module. HRM's own set is in the
[hrm-service README](../../services/hrm-service/README.md#permissions).

### Adding a fine-grained permission

The `<module>.<entity>.<action>` names in your constants class are forward-compatible: the
code accepts them whether or not they exist yet. When you want finer grants than the job
roles above:

1. Admin console → realm **erp** → **Realm roles** → **Create role**.
2. Name it **exactly** as it appears in your `@PreAuthorize`: `crm.customer.create`.
3. Assign it to whoever needs it. No code change — the expression already names it.

Because reads match on prefix, any `crm.*` role also opens CRM reads. Give a service
account a read-only permission such as `crm.service.read` rather than a human job role;
HRM does exactly that for `erp-backend`.

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
| `hasRole('crm_admin')` never matches | Use **`hasAuthority`**, not `hasRole` — our converter stores roles verbatim (no `ROLE_` prefix). |
| Swagger/health blocked | Add its path to the `permitAll()` list in Step 4. |
| Startup fails contacting Keycloak | Keycloak not up yet, or wrong issuer host. `docker compose ps` → is `erp-keycloak` healthy? |

## Checklist (per module)

- [ ] Resource-server + security deps added
- [ ] `issuer-uri` set in `application.yml`
- [ ] `KeycloakRealmRoleConverter` + `SecurityConfig` + `<Module>Permissions` in `shared/security`
- [ ] Every write endpoint has `@PreAuthorize("hasAuthority('<module>.<entity>.<action>')")`
- [ ] Reads use the module-prefix expression; another module's role is refused (test it)
- [ ] Any new fine-grained permission added to Keycloak **and** `realm-export.json`
- [ ] Verified `200 / 401 / 403` with a test token
