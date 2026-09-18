package com.company.fms.shared;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException exception) {
        return failure(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiResponse<Void>> handleConflict(ConflictException exception) {
        return failure(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException exception) {
        return failure(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(FmsWorkflowException.class)
    ResponseEntity<ApiResponse<Void>> handleWorkflow(FmsWorkflowException exception) {
        return failure(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fields = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(field -> fields.putIfAbsent(field.getField(), field.getDefaultMessage()));
        String detail = "Request validation failed: " + fields.entrySet().stream()
                .map(e -> e.getKey() + " " + e.getValue())
                .collect(Collectors.joining("; "));
        return failure(HttpStatus.BAD_REQUEST, detail);
    }

    private ResponseEntity<ApiResponse<Void>> failure(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(ApiResponse.failure(message));
    }
}
