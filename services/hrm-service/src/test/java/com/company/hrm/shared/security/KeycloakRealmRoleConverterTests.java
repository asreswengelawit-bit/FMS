package com.company.hrm.shared.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

class KeycloakRealmRoleConverterTests {

    private final KeycloakRealmRoleConverter converter = new KeycloakRealmRoleConverter();

    @Test
    void mapsRealmRolesVerbatimSoHasAuthorityMatches() {
        Jwt jwt = jwt(builder -> builder
                .claim("realm_access", Map.of("roles", List.of("hrm_user", "hrm.employee.create"))));

        AbstractAuthenticationToken authentication = converter.convert(jwt);

        assertThat(authorities(authentication)).containsExactlyInAnyOrder("hrm_user", "hrm.employee.create");
        assertThat(authentication.getName()).isEqualTo("abebe.bekele");
    }

    @Test
    void includesBackendClientRoles() {
        Jwt jwt = jwt(builder -> builder
                .claim("realm_access", Map.of("roles", List.of("hrm_user")))
                .claim("resource_access", Map.of(
                        "erp-backend", Map.of("roles", List.of("hrm.payroll.process")),
                        "other-service", Map.of("roles", List.of("prms.supplier.create")))));

        assertThat(authorities(converter.convert(jwt)))
                .containsExactlyInAnyOrder("hrm_user", "hrm.payroll.process");
    }

    @Test
    void toleratesATokenWithoutRoleClaims() {
        assertThat(authorities(converter.convert(jwt(builder -> builder)))).isEmpty();
    }

    private static Jwt jwt(java.util.function.UnaryOperator<Jwt.Builder> customizer) {
        return customizer.apply(Jwt.withTokenValue("token")
                .header("alg", "RS256")
                .claim("preferred_username", "abebe.bekele")).build();
    }

    private static List<String> authorities(AbstractAuthenticationToken authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
    }
}
