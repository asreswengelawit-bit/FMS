package com.company.hrm.shared.audit;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

/**
 * Wires {@code created_by} / {@code updated_by} to the caller's Keycloak username, so
 * critical business actions stay traceable (README §7).
 */
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class JpaAuditingConfig {

    private static final String SYSTEM = "system";

    @Bean
    AuditorAware<String> auditorAware() {
        return () -> Optional.of(currentUsername());
    }

    private String currentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return SYSTEM;
        }
        if (authentication instanceof JwtAuthenticationToken token) {
            Jwt jwt = token.getToken();
            String username = jwt.getClaimAsString("preferred_username");
            if (username != null) {
                return username;
            }
        }
        return authentication.getName() != null ? authentication.getName() : SYSTEM;
    }
}
