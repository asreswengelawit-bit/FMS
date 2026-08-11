package com.crm.crm_backend.exception;

public class LeadNotFoundException extends RuntimeException {

    public LeadNotFoundException() {
        super();
    }

    public LeadNotFoundException(String message) {
        super(message);
    }

    public LeadNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}