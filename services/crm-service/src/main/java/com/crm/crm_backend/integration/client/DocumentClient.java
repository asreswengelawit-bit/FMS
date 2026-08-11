package com.crm.crm_backend.integration.client;

import com.crm.crm_backend.config.properties.IntegrationProperties;
import com.crm.crm_backend.integration.dto.DocumentDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DocumentClient {

    private final WebClient.Builder webClientBuilder;
    private final IntegrationProperties integrationProperties;

    public Optional<DocumentDTO> fetchDocument(String documentId) {
        try {
            DocumentDTO document = webClientBuilder.build()
                    .get()
                    .uri(integrationProperties.getAuth().getBaseUrl() + "/api/documents/{id}", documentId)
                    .retrieve()
                    .bodyToMono(DocumentDTO.class)
                    .block();
            return Optional.ofNullable(document);
        } catch (Exception ex) {
            log.warn("Document fetch failed for {}: {}", documentId, ex.getMessage());
            return Optional.empty();
        }
    }
}
