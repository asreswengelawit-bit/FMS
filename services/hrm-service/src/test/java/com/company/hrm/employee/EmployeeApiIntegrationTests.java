package com.company.hrm.employee;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isA;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.company.hrm.PostgresTestBase;
import com.jayway.jsonpath.JsonPath;

/**
 * End-to-end check of the HRM conventions on the employee endpoints: the /api/v1 path, the
 * shared response envelope, bean validation, and the audit columns filled in by JPA
 * auditing.
 */
@SpringBootTest(properties = "hrm.security.enabled=false")
@AutoConfigureMockMvc
class EmployeeApiIntegrationTests extends PostgresTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createsAnEmployeeUnderADepartmentAndReturnsTheSharedEnvelope() throws Exception {
        String department = mockMvc.perform(post("/api/v1/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "name": "Engineering", "description": "Builds the ERP" }"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Department created")))
                .andExpect(jsonPath("$.timestamp", isA(String.class)))
                .andExpect(jsonPath("$.data.name", is("Engineering")))
                // audit columns are populated even without a JWT
                .andExpect(jsonPath("$.data.createdAt", notNullValue()))
                .andReturn().getResponse().getContentAsString();

        long departmentId = ((Number) JsonPath.read(department, "$.data.id")).longValue();

        String employee = mockMvc.perform(post("/api/v1/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "employeeCode": "EMP-0001",
                          "firstName": "Abebe",
                          "lastName": "Bekele",
                          "gender": "MALE",
                          "email": "abebe.bekele@example.com",
                          "jobTitle": "Backend Engineer",
                          "salary": 24000.0000,
                          "hireDate": "2026-07-01",
                          "departmentId": %d
                        }""".formatted(departmentId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.employeeCode", is("EMP-0001")))
                .andExpect(jsonPath("$.data.jobTitle", is("Backend Engineer")))
                .andExpect(jsonPath("$.data.departmentId", is((int) departmentId)))
                .andExpect(jsonPath("$.data.department", is("Engineering")))
                .andExpect(jsonPath("$.data.status", is("ACTIVE")))
                .andReturn().getResponse().getContentAsString();

        long employeeId = ((Number) JsonPath.read(employee, "$.data.id")).longValue();

        mockMvc.perform(get("/api/v1/employees/{id}", employeeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email", is("abebe.bekele@example.com")));
    }

    @Test
    void rejectsAnEmployeeThatIsMissingRequiredFields() throws Exception {
        mockMvc.perform(post("/api/v1/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "firstName": "Nohandle" }"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Validation failed")))
                .andExpect(jsonPath("$.data.employeeCode", notNullValue()))
                .andExpect(jsonPath("$.data.lastName", notNullValue()))
                .andExpect(jsonPath("$.data.gender", notNullValue()));
    }

    @Test
    void returns404ForAnUnknownEmployee() throws Exception {
        mockMvc.perform(get("/api/v1/employees/{id}", 987654321L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
