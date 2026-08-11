package com.crm.crm_backend.service.integration;

import com.crm.crm_backend.integration.client.DocumentClient;
import com.crm.crm_backend.integration.dto.DocumentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentClient documentClient;

    public Optional<DocumentDTO> getDocument(String documentId) {
        return documentClient.fetchDocument(documentId);
    }
}
