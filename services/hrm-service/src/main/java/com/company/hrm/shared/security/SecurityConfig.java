package com.company.hrm.shared.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Stateless OAuth2 resource server against the shared Keycloak realm
 * (docs/architecture/module-auth-integration.md, steps 3–4).
 *
 * <p>Everything except health and the OpenAPI docs requires a valid JWT; individual
 * endpoints add {@code @PreAuthorize} on top (see {@link HrmPermissions}).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Set {@code hrm.security.enabled=false} to run the service without Keycloak — local
     * schema work and integration tests only, never a deployed profile. It switches off
     * both the resource server and {@code @PreAuthorize} (see {@link MethodSecurityConfig}).
     */
    @Value("${hrm.security.enabled:true}")
    private boolean securityEnabled;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(
                            "/actuator/health/**",
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html").permitAll();
                    if (securityEnabled) {
                        auth.anyRequest().authenticated();
                    } else {
                        auth.anyRequest().permitAll();
                    }
                });

        if (securityEnabled) {
            http.oauth2ResourceServer(oauth -> oauth
                    .jwt(jwt -> jwt.jwtAuthenticationConverter(new KeycloakRealmRoleConverter())));
        }

        return http.build();
    }

    /** {@code @PreAuthorize} support — off together with the resource server. */
    @Configuration
    @EnableMethodSecurity
    @ConditionalOnProperty(name = "hrm.security.enabled", havingValue = "true", matchIfMissing = true)
    static class MethodSecurityConfig {
    }
}
