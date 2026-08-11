package com.crm.crm_backend.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "crm.integration")
public class IntegrationProperties {

    private ServiceEndpoint auth = new ServiceEndpoint("http://localhost:8081");
    private ServiceEndpoint hrm = new ServiceEndpoint("http://localhost:8091");
    private ServiceEndpoint mms = new ServiceEndpoint("http://localhost:8092");
    private ServiceEndpoint fms = new ServiceEndpoint("http://localhost:8093");
    private int connectTimeoutMs = 3000;
    private int readTimeoutMs = 5000;

    @Data
    public static class ServiceEndpoint {
        private String baseUrl;
        private boolean enabled = true;
        /**
         * When false, upstream failures return empty/false instead of fake success data.
         * Keep true for local/dev; set false in production.
         */
        private boolean allowFallback = true;

        public ServiceEndpoint() {
        }

        public ServiceEndpoint(String baseUrl) {
            this.baseUrl = baseUrl;
        }
    }
}
