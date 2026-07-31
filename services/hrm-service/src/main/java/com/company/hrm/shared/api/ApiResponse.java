package com.company.hrm.shared.api;

import java.time.Instant;

/**
 * The repo-wide REST response envelope (README §6).
 *
 * <pre>
 * { "success": true, "message": "...", "data": { }, "timestamp": "2026-07-08T12:00:00Z" }
 * </pre>
 */
public record ApiResponse<T>(boolean success, String message, T data, Instant timestamp) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "OK", data, Instant.now());
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, message, data, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, Instant.now());
    }
}
