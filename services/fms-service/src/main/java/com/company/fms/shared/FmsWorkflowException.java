package com.company.fms.shared;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Raised when a workflow transition is invalid, e.g. approving an already-approved
 * document, posting in a closed accounting period, or balancing a journal that is
 * out of balance. Maps to 409 Conflict.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class FmsWorkflowException extends RuntimeException {
    public FmsWorkflowException(String message) {
        super(message);
    }
}
