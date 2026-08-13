package com.company.mms.supplier;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.transaction.AfterTransaction;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class SupplierControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createsListsAndSoftDeletesSupplierThroughTheApi() throws Exception {
        String payload = """
                {
                  "id": "SUP-API-001",
                  "name": "Abay Stationery",
                  "contactPerson": "Alem Tesfaye",
                  "email": "sales@abay.example",
                  "phoneNumber": "+251911000000",
                  "address": "Addis Ababa"
                }
                """;

        mockMvc.perform(post("/api/v1/suppliers")
                        .with(user("inventory-manager").roles("inventory_manager"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/v1/suppliers/SUP-API-001"))
                .andExpect(jsonPath("$.id").value("SUP-API-001"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        mockMvc.perform(get("/api/v1/suppliers?status=ACTIVE")
                        .with(user("viewer").roles("viewer")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("SUP-API-001"));

        mockMvc.perform(delete("/api/v1/suppliers/SUP-API-001")
                        .with(user("inventory-manager").roles("inventory_manager")))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/suppliers?status=INACTIVE")
                        .with(user("viewer").roles("viewer")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("INACTIVE"));
    }
}
