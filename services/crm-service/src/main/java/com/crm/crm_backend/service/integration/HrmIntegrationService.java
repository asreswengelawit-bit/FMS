package com.crm.crm_backend.service.integration;

import com.crm.crm_backend.integration.client.HrmClient;
import com.crm.crm_backend.integration.dto.HrmEmployeeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HrmIntegrationService {

    private final HrmClient hrmClient;

    public Optional<HrmEmployeeDTO> resolveEmployee(Long employeeId) {
        return hrmClient.getEmployeeById(employeeId);
    }

    public Optional<HrmEmployeeDTO> resolveEmployeeByEmail(String email) {
        return hrmClient.getEmployeeByEmail(email);
    }
}
