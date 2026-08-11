package com.crm.crm_backend.security.JwtBlacklist;

/**
 * Shared Redis key namespace for JWT access-token blacklist (auth ↔ gateway ↔ CRM).
 */
public final class JwtBlacklistKeys {

    public static final String KEY_PREFIX = "auth:jwt:blacklist:";

    private JwtBlacklistKeys() {
    }

    public static String key(String jti) {
        return KEY_PREFIX + jti;
    }
}
