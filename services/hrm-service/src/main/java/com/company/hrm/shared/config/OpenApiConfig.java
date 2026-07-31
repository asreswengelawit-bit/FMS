package com.company.hrm.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

/**
 * Swagger UI setup, including the bearer-token box so endpoints can be tried with a real
 * Keycloak access token (README §6: every service exposes OpenAPI).
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearer-jwt";

    @Bean
    OpenAPI hrmOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("HRM Service API")
                        .version("v1")
                        .description("""
                                Human Resource Management module of INSA-ERP: employees, departments and \
                                organizational structure, attendance, leave, payroll source data and recruitment.

                                All endpoints are under /api/v1 and return the shared envelope \
                                { success, message, data, timestamp }. Authenticate with a Keycloak \
                                access token from the `erp` realm."""))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME));
    }
}
