package com.company.hrm.shared.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class DatabaseUrlEnvironmentPostProcessorTests {

    private final DatabaseUrlEnvironmentPostProcessor postProcessor = new DatabaseUrlEnvironmentPostProcessor();

    @Test
    void derivesTheDatasourceFromTheRepoWideDatabaseUrl() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DATABASE_URL", "postgresql://neondb_owner:npg_secret@ep-abc.aws.neon.tech/neondb"
                        + "?sslmode=require&channel_binding=require");

        postProcessor.postProcessEnvironment(environment, null);

        assertThat(environment.getProperty("spring.datasource.url")).isEqualTo(
                "jdbc:postgresql://ep-abc.aws.neon.tech/neondb"
                        + "?currentSchema=hrm_schema&sslmode=require&channelBinding=require");
        assertThat(environment.getProperty("spring.datasource.username")).isEqualTo("neondb_owner");
        assertThat(environment.getProperty("spring.datasource.password")).isEqualTo("npg_secret");
    }

    @Test
    void keepsAnExplicitPortAndUrlEncodedCredentials() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DATABASE_URL", "postgres://erp%40hrm:p%40ss%3Aword@localhost:55432/erp");

        postProcessor.postProcessEnvironment(environment, null);

        assertThat(environment.getProperty("spring.datasource.url"))
                .isEqualTo("jdbc:postgresql://localhost:55432/erp?currentSchema=hrm_schema");
        assertThat(environment.getProperty("spring.datasource.username")).isEqualTo("erp@hrm");
        assertThat(environment.getProperty("spring.datasource.password")).isEqualTo("p@ss:word");
    }

    @Test
    void leavesAnExplicitlyConfiguredDatasourceAlone() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DATABASE_URL", "postgresql://ignored:ignored@ignored/ignored")
                .withProperty("spring.datasource.url", "jdbc:postgresql://localhost:5432/override");

        postProcessor.postProcessEnvironment(environment, null);

        assertThat(environment.getProperty("spring.datasource.url"))
                .isEqualTo("jdbc:postgresql://localhost:5432/override");
    }

    @Test
    void doesNothingWithoutADatabaseUrl() {
        MockEnvironment environment = new MockEnvironment();

        postProcessor.postProcessEnvironment(environment, null);

        assertThat(environment.getProperty("spring.datasource.url")).isNull();
    }
}
