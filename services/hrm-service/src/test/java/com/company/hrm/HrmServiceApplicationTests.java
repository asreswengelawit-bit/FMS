package com.company.hrm;

import static org.assertj.core.api.Assertions.assertThat;

import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Boots the whole service against a real Postgres: Flyway applies every migration and
 * Hibernate then validates the entity mappings against the result, so a migration that
 * drifts from an entity fails the build.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "hrm.security.enabled=false")
class HrmServiceApplicationTests extends PostgresTestBase {

    @Autowired
    private DataSource dataSource;

    @Test
    void contextLoads() {
        assertThat(dataSource).isNotNull();
    }

    @Test
    void flywayAppliedEveryMigrationToHrmSchema() {
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);

        Integer failed = jdbc.queryForObject(
                "SELECT count(*) FROM hrm_schema.flyway_schema_history WHERE success = false", Integer.class);
        assertThat(failed).isZero();

        Integer applied = jdbc.queryForObject(
                "SELECT count(*) FROM hrm_schema.flyway_schema_history WHERE type <> 'SCHEMA'", Integer.class);
        assertThat(applied).isEqualTo(11);

        Integer tables = jdbc.queryForObject(
                "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'hrm_schema'", Integer.class);
        assertThat(tables).isGreaterThanOrEqualTo(27);
    }
}
