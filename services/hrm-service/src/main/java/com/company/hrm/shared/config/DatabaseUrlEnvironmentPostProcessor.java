package com.company.hrm.shared.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

/**
 * Turns the repo-wide {@code DATABASE_URL} into the {@code spring.datasource.*} triple.
 *
 * <p>The root {@code .env} holds one libpq-style URL for every service
 * ({@code postgresql://user:pass@host/db?sslmode=require}) while Spring wants a
 * {@code jdbc:} URL plus a separate username and password. This bridges the two and pins
 * the connection to {@code hrm_schema} (docs/architecture/database-strategy.md), so a team
 * member only ever has to set {@code DATABASE_URL}.
 *
 * <p>Skipped entirely when {@code spring.datasource.url} is already set, so
 * {@code SPRING_DATASOURCE_URL} and profile-specific overrides still win.
 *
 * <p>Registered in {@code META-INF/spring.factories}.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    static final String SCHEMA = "hrm_schema";
    private static final String PROPERTY_SOURCE_NAME = "hrmDatabaseUrl";

    /** libpq parameter names that pgjdbc spells differently. */
    private static final Map<String, String> PARAM_ALIASES = Map.of(
            "channel_binding", "channelBinding",
            "connect_timeout", "connectTimeout",
            "application_name", "ApplicationName");

    @Override
    public int getOrder() {
        // after config data (application.yml and the imported .env) has been loaded
        return ConfigDataEnvironmentPostProcessor.ORDER + 1;
    }

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (StringUtils.hasText(environment.getProperty("spring.datasource.url"))) {
            return;
        }
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (!StringUtils.hasText(databaseUrl)) {
            return;
        }
        Map<String, Object> properties = parse(databaseUrl.trim());
        environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, properties));
    }

    private Map<String, Object> parse(String databaseUrl) {
        URI uri = URI.create(databaseUrl);
        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://").append(uri.getHost());
        if (uri.getPort() > 0) {
            jdbcUrl.append(':').append(uri.getPort());
        }
        jdbcUrl.append(StringUtils.hasText(uri.getPath()) ? uri.getPath() : "/postgres");
        jdbcUrl.append('?').append(jdbcQuery(uri.getRawQuery()));

        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("spring.datasource.url", jdbcUrl.toString());

        String userInfo = uri.getRawUserInfo();
        if (StringUtils.hasText(userInfo)) {
            String[] credentials = userInfo.split(":", 2);
            properties.put("spring.datasource.username", decode(credentials[0]));
            if (credentials.length == 2) {
                properties.put("spring.datasource.password", decode(credentials[1]));
            }
        }
        return properties;
    }

    /** Keeps the caller's query parameters, renames libpq spellings, forces our schema. */
    private String jdbcQuery(String rawQuery) {
        StringBuilder query = new StringBuilder("currentSchema=").append(SCHEMA);
        if (!StringUtils.hasText(rawQuery)) {
            return query.toString();
        }
        for (String pair : rawQuery.split("&")) {
            if (!StringUtils.hasText(pair)) {
                continue;
            }
            int eq = pair.indexOf('=');
            String name = eq < 0 ? pair : pair.substring(0, eq);
            if ("currentSchema".equals(name)) {
                continue;
            }
            String value = eq < 0 ? null : pair.substring(eq + 1);
            query.append('&').append(PARAM_ALIASES.getOrDefault(name, name));
            if (value != null) {
                query.append('=').append(value);
            }
        }
        return query.toString();
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
