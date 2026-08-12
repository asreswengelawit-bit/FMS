package com.crm.crm_backend.security.JwtBlacklist;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "crm.security.jwt.blacklist-enabled", havingValue = "true")
@ConditionalOnBean(StringRedisTemplate.class)
public class RedisJwtBlacklistChecker {

    private final StringRedisTemplate redisTemplate;
    private final boolean failClosed;

    public RedisJwtBlacklistChecker(
            StringRedisTemplate redisTemplate,
            @Value("${crm.security.jwt.blacklist-fail-closed:true}") boolean failClosed) {
        this.redisTemplate = redisTemplate;
        this.failClosed = failClosed;
    }

    public boolean isBlacklisted(String jti) {
        if (jti == null || jti.isBlank()) {
            return false;
        }
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(JwtBlacklistKeys.key(jti)));
        } catch (Exception ex) {
            if (failClosed) {
                throw new IllegalStateException("JWT blacklist check failed", ex);
            }
            return false;
        }
    }
}
