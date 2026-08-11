# CRM Service (Team 4)

Spring Boot CRM microservice for **INSA-ERP**, located at `services/crm-service/`.

Auth follows the ERP Keycloak standard (OAuth2 resource server).

## Ports

| Service | Port | Role |
|---------|------|------|
| Keycloak (ERP-INSA root `docker compose`) | **8080** | Identity provider — realm `erp` |
| CRM service (this folder) | **8082** | CRM domain APIs |
| RabbitMQ (this folder `docker compose`) | **5672** / **15672** | Domain events |

## Stack

- Java 21, Spring Boot 3.5.x, Maven
- Spring Security OAuth2 Resource Server (Keycloak JWKS)
- PostgreSQL (Neon) + Flyway
- RabbitMQ

## Setup

```bash
# From ERP-INSA root — Keycloak
docker compose up -d

# From this folder — RabbitMQ
docker compose up -d rabbitmq

# Local config (gitignored)
copy src\main\resources\application.properties.example src\main\resources\application.properties
# Fill Neon DB_* and confirm Keycloak issuer:
# spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/erp

# Run
.\mvnw.cmd spring-boot:run
```

API base: `http://localhost:8082` with `Authorization: Bearer <Keycloak access token>`.

Frontend calls this via `CRM_API_BASE_URL` (default `http://localhost:8082`).

## Auth

Login is owned by Keycloak + the Next.js app. This service validates JWTs only.

Required authorities: `crm_user` and/or `admin` (plus `fms_user` on some read endpoints).

## Notes

- Do **not** commit `application.properties` (secrets). Use the `.example` file.
- Legacy `auth-service` / optional API gateway lived in the old standalone repo and are **not** part of this monorepo path.
- Package root remains `com.crm.crm_backend` for continuity with the existing codebase.
