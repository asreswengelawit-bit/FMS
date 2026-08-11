package com.crm.crm_backend.exception;

public class AuditTrailNotFoundException extends RuntimeException {
    public AuditTrailNotFoundException(String message) {
        super(message);
    }
}
