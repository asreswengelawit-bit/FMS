package com.crm.crm_backend.security;

import com.crm.crm_backend.controller.LeadController;
import com.crm.crm_backend.dto.response.LeadResponseDTO;
import com.crm.crm_backend.security.SecurityConfig.SecurityConfig;
import com.crm.crm_backend.service.core.LeadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = LeadController.class)
@Import(SecurityConfig.class)
@TestPropertySource(properties = {
        "crm.security.auth-mode=keycloak",
        "crm.cors.allowed-origins=http://localhost:3000"
})
class JwtProtectedApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LeadService leadService;

    /** Prevents auto-config from contacting a real Keycloak issuer during the test. */
    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void protectedEndpointRejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/leads/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpointAcceptsValidJwt() throws Exception {
        LeadResponseDTO dto = new LeadResponseDTO();
        dto.setId(1L);
        dto.setFirstName("Ada");
        dto.setLastName("Lovelace");
        when(leadService.getLeadById(eq(1L))).thenReturn(dto);

        mockMvc.perform(get("/api/leads/1")
                        .with(jwt()
                                .jwt(j -> j
                                        .claim("preferred_username", "erp-admin")
                                        .claim("realm_access", java.util.Map.of(
                                                "roles", java.util.List.of("admin", "crm_user"))))
                                .authorities(new SimpleGrantedAuthority("admin"),
                                        new SimpleGrantedAuthority("crm_user"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.firstName").value("Ada"));
    }
}
