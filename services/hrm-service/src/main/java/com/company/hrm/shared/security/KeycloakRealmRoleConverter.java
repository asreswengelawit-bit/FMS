package com.company.hrm.shared.security;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

/**
 * Turns Keycloak's {@code realm_access.roles} into Spring authorities <em>verbatim</em>
 * (no {@code ROLE_} prefix), so both {@code hrm_user} and {@code hrm.employee.create}
 * work with {@code hasAuthority(...)}.
 *
 * <p>Client roles for the {@code erp-backend} client are picked up too, which is where
 * fine-grained permissions land when they are modelled as client roles rather than realm
 * roles.
 *
 * @see com.company.hrm.shared.security.HrmPermissions
 */
public class KeycloakRealmRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final String BACKEND_CLIENT_ID = "erp-backend";

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Set<GrantedAuthority> authorities = Stream.concat(realmRoles(jwt).stream(), clientRoles(jwt).stream())
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        return new JwtAuthenticationToken(jwt, authorities, jwt.getClaimAsString("preferred_username"));
    }

    @SuppressWarnings("unchecked")
    private Collection<String> realmRoles(Jwt jwt) {
        Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims()
                .getOrDefault("realm_access", Map.of());
        return (Collection<String>) realmAccess.getOrDefault("roles", List.of());
    }

    @SuppressWarnings("unchecked")
    private Collection<String> clientRoles(Jwt jwt) {
        Map<String, Object> resourceAccess = (Map<String, Object>) jwt.getClaims()
                .getOrDefault("resource_access", Map.of());
        Map<String, Object> client = (Map<String, Object>) resourceAccess
                .getOrDefault(BACKEND_CLIENT_ID, Map.of());
        return (Collection<String>) client.getOrDefault("roles", List.of());
    }
}
