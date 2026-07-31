# ============================================================================
# hrm-service — Human Resource Management (Team 1)
#
# Build from the repo root so the context can reach services/hrm-service:
#   docker build -f infrastructure/docker/hrm-service.Dockerfile -t erp/hrm-service .
#
# Run (DATABASE_URL is the same libpq-style URL every service uses; hrm-service
# derives its JDBC settings from it and pins currentSchema=hrm_schema):
#   docker run -p 8081:8081 \
#     -e DATABASE_URL="postgresql://user:pass@host/erp?sslmode=require" \
#     -e KEYCLOAK_ISSUER_URI="http://keycloak:8080/realms/erp" \
#     erp/hrm-service
# ============================================================================

# ---- Build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# Wrapper and build scripts first, so dependency resolution is cached separately
# from source changes.
COPY services/hrm-service/gradlew services/hrm-service/settings.gradle services/hrm-service/build.gradle ./
COPY services/hrm-service/gradle ./gradle
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies

COPY services/hrm-service/src ./src
# Tests need Docker (Testcontainers), so they run in CI, not in the image build.
RUN ./gradlew --no-daemon bootJar -x test

# ---- Run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Never run the service as root.
RUN groupadd --system spring && useradd --system --gid spring spring
USER spring:spring

COPY --from=build /workspace/build/libs/*.jar app.jar

EXPOSE 8081

# The JRE image ships no curl; probe the actuator over bash's /dev/tcp, same
# trick the root docker-compose.yml uses for Keycloak.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
    CMD exec 3<>/dev/tcp/127.0.0.1/8081 \
    && printf 'GET /actuator/health HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n' >&3 \
    && grep -q '"status":"UP"' <&3

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
