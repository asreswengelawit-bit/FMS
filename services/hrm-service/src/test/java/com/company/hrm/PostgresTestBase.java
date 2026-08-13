package com.company.hrm;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Shared Postgres for integration tests. The container is static, so it starts once per
 * build and every test class runs against the same migrated schema.
 *
 * <p>Each test class declares its own {@code hrm.security.enabled}: off for the functional
 * tests, on for {@link com.company.hrm.shared.security.EndpointAuthorizationTests}.
 */
@Testcontainers
public abstract class PostgresTestBase {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:16")
            .withDatabaseName("erp");
}
