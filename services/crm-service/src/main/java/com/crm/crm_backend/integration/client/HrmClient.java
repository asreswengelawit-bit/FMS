package com.crm.crm_backend.integration.client;

import com.crm.crm_backend.config.properties.IntegrationProperties;
import com.crm.crm_backend.integration.dto.HrmEmployeeDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class HrmClient {

    private final WebClient.Builder webClientBuilder;
    private final IntegrationProperties integrationProperties;

    public Optional<HrmEmployeeDTO> getEmployeeById(Long employeeId) {
        if (!integrationProperties.getHrm().isEnabled()) {
            log.debug("HRM integration disabled; skipping employee lookup {}", employeeId);
            return Optional.empty();
        }
        try {
            HrmEmployeeDTO employee = webClientBuilder.build()
                    .get()
                    .uri(integrationProperties.getHrm().getBaseUrl() + "/api/hrm/employees/{id}", employeeId)
                    .retrieve()
                    .bodyToMono(HrmEmployeeDTO.class)
                    .block();
            return Optional.ofNullable(employee);
        } catch (WebClientResponseException.NotFound ex) {
            log.info("HRM employee {} not found", employeeId);
            return Optional.empty();
        } catch (Exception ex) {
            log.warn("HRM getEmployeeById failed for {}: {}", employeeId, ex.getMessage());
            return Optional.empty();
        }
    }

    public Optional<HrmEmployeeDTO> getEmployeeByEmail(String email) {
        if (!integrationProperties.getHrm().isEnabled()) {
            return Optional.empty();
        }
        try {
            String uri = UriComponentsBuilder
                    .fromUriString(integrationProperties.getHrm().getBaseUrl() + "/api/hrm/employees")
                    .queryParam("email", email)
                    .toUriString();

            HrmEmployeeDTO employee = webClientBuilder.build()
                    .get()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(HrmEmployeeDTO.class)
                    .block();
            return Optional.ofNullable(employee);
        } catch (Exception ex) {
            log.warn("HRM getEmployeeByEmail failed for {}: {}", email, ex.getMessage());
            return Optional.empty();
        }
    }
}
