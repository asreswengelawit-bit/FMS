package com.company.fms.shared;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Resolves the current authenticated principal for audit/createdBy fields.
 * In dev-auth mode this returns the injected "local-dev" principal; with Keycloak
 * it returns the JWT subject (sub claim) when available.
 */
@Component
public class CurrentUser {

    public String get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "system";
        }
        return authentication.getName() != null ? authentication.getName() : "system";
    }
}
