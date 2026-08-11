package com.crm.crm_backend.security.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

/**
 * Legacy HS256 JWT validation for auth-service tokens.
 * Active only when {@code crm.security.auth-mode=legacy}.
 */
@Service
@ConditionalOnProperty(name = "crm.security.auth-mode", havingValue = "legacy")
public class JwtService {

    @Value("${crm.security.jwt.secret}")
    private String secret;

    @Value("${crm.security.jwt.expiration-ms}")
    private long expirationMs;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    public String extractJti(String token) {
        return extractClaim(token, claims -> {
            String jti = claims.getId();
            if (jti == null || jti.isBlank()) {
                Object claim = claims.get("jti");
                return claim != null ? String.valueOf(claim) : null;
            }
            return jti;
        });
    }

    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception ex) {
            return false;
        }
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
