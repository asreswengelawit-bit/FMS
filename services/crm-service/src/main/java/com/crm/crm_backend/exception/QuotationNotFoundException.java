package com.crm.crm_backend.exception;


public class QuotationNotFoundException extends RuntimeException {

    public QuotationNotFoundException(String message) {
        super(message);
    }
}