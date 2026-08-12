package com.crm.crm_backend.integration.client;

import com.crm.crm_backend.config.properties.IntegrationProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthClient {

    private final WebClient.Builder webClientBuilder;
    private final IntegrationProperties integrationProperties;

    public Optional<Map<String, Object>> getHealth() {
        if (!integrationProperties.getAuth().isEnabled()) {
            return Optional.empty();
        }
        try {
            Map<String, Object> body = webClientBuilder.build()
                    .get()
                    .uri(integrationProperties.getAuth().getBaseUrl() + "/actuator/health")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
            return Optional.ofNullable(body);
        } catch (WebClientResponseException ex) {
            log.warn("Auth service health check failed: status={}", ex.getStatusCode());
            return Optional.empty();
        } catch (Exception ex) {
            log.warn("Auth service unreachable: {}", ex.getMessage());
            return Optional.empty();
        }
    }
}
