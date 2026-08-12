package com.company.hrm.shared.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.company.hrm.PostgresTestBase;

/**
 * Security is on for this slice: reads need module access, writes need the fine-grained
 * permission or the owning role — 401 without a token, 403 with the wrong one
 * (docs/architecture/module-auth-integration.md step 7).
 */
// A jwk-set-uri keeps the decoder lazy, so the context starts without Keycloak running;
// these tests inject authentication directly instead of presenting real tokens.
@SpringBootTest(properties = {
        "hrm.security.enabled=true",
        "spring.security.oauth2.resourceserver.jwt.jwk-set-uri="
                + "http://localhost:8080/realms/erp/protocol/openid-connect/certs" })
@AutoConfigureMockMvc
class EndpointAuthorizationTests extends PostgresTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rejectsAnAnonymousRequest() throws Exception {
        mockMvc.perform(get("/api/v1/employees"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void allowsAnyHrmScopedRoleToRead() throws Exception {
        mockMvc.perform(get("/api/v1/employees").with(jwt().authorities(authority("hrm_employee"))))
                .andExpect(status().isOk());
    }

    @Test
    void allowsAFineGrainedHrmPermissionToRead() throws Exception {
        mockMvc.perform(get("/api/v1/employees").with(jwt().authorities(authority("hrm.employee.read"))))
                .andExpect(status().isOk());
    }

    /** Module access is scoped by prefix, so another module's role must not open HRM. */
    @Test
    void refusesAReadFromAnotherModulesRole() throws Exception {
        mockMvc.perform(get("/api/v1/employees").with(jwt().authorities(authority("crm_admin"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void refusesAWriteFromAReadOnlyHrmRole() throws Exception {
        mockMvc.perform(post("/api/v1/departments")
                .with(jwt().authorities(authority("hrm_employee")))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "name": "Should not be created" }"""))
                .andExpect(status().isForbidden());
    }

    @Test
    void acceptsAWriteFromTheOwningRole() throws Exception {
        mockMvc.perform(post("/api/v1/departments")
                .with(jwt().authorities(authority("hrm_admin")))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "name": "Finance" }"""))
                .andExpect(status().isCreated());
    }

    @Test
    void acceptsAWriteFromTheFineGrainedPermission() throws Exception {
        mockMvc.perform(post("/api/v1/departments")
                .with(jwt().authorities(authority("hrm.department.create")))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "name": "Procurement liaison" }"""))
                .andExpect(status().isCreated());
    }

    @Test
    void leavesHealthAndDocsOpen() throws Exception {
        mockMvc.perform(get("/actuator/health")).andExpect(status().isOk());
        mockMvc.perform(get("/v3/api-docs")).andExpect(status().isOk());
    }

    private static org.springframework.security.core.GrantedAuthority authority(String name) {
        return new org.springframework.security.core.authority.SimpleGrantedAuthority(name);
    }
}
