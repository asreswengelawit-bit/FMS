# Copilot Instructions for crm-backend

This is a Java Spring Boot CRM backend service.

## Project summary
- Maven project using Spring Boot `3.5.16` and Java `21`.
- REST API backend for CRM functionality: customers, leads, products, orders, invoices, quotations, sales, dashboard, reporting, notifications, audit logging, role/user management, and authentication.
- Uses Spring Data JPA with PostgreSQL.
- Main application class: `src/main/java/com/crm/crm_backend/CrmBackendApplication.java`.
- Configuration file: `src/main/resources/application.properties`.
- Database connection uses PostgreSQL on `localhost:5433` with database `crm_db`.

## Key project conventions
- Package root is `com.crm.crm_backend` (note underscore in `crm_backend`).
- Lombok is used for entities and DTOs.
- `spring.jpa.hibernate.ddl-auto=update` is enabled in development config.
- Security uses JWT filters under `src/main/java/com/crm/crm_backend/security`.
- Custom exception handling lives in `src/main/java/com/crm/crm_backend/exception`.

## Usage guidance for Copilot
- Prefer Spring Boot idioms, controller-service-repository layering, and DTO mapping patterns used in this project.
- Keep package names consistent with `com.crm.crm_backend`.
- Do not rename the root package to `com.crm.crm-backend`.
- Preserve existing entity relationships and validation annotations when extending domain models.
- When generating new endpoints, follow the existing module structure and folder conventions.

## Common commands
- Build: `./mvnw clean package`
- Run: `./mvnw spring-boot:run`
- Test: `./mvnw test`

## Notes
- There is no existing `README.md`; use `HELP.md` for repository guidance.
- The project currently uses PostgreSQL credentials stored in plain text for local development.
