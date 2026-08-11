package com.crm.crm_backend.util.helper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;

public final class AuditUtils {

    private AuditUtils() {
    }

    public static String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "SYSTEM";
        }
        String name = auth.getName();
        if (name == null || name.isBlank() || "anonymousUser".equalsIgnoreCase(name)) {
            return "SYSTEM";
        }
        return name;
    }

    public static String clientIp() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return "127.0.0.1";
        }
        HttpServletRequest request = attrs.getRequest();
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        String remote = request.getRemoteAddr();
        return remote != null ? remote : "127.0.0.1";
    }

    public static Long resolveEntityId(Object result, Object[] args) {
        Long fromResult = extractId(result);
        if (fromResult != null && fromResult > 0) {
            return fromResult;
        }
        if (args != null) {
            for (Object arg : args) {
                if (arg instanceof Long id && id > 0) {
                    return id;
                }
                Long nested = extractId(arg);
                if (nested != null && nested > 0) {
                    return nested;
                }
            }
        }
        return 0L;
    }

    public static String buildDescription(
            String action,
            String entityName,
            Long entityId,
            String beforeNote,
            String afterNote) {

        StringBuilder sb = new StringBuilder();
        sb.append(action).append(' ').append(entityName);
        if (entityId != null && entityId > 0) {
            sb.append(" #").append(entityId);
        }
        if (beforeNote != null && !beforeNote.isBlank()) {
            sb.append(" | before: ").append(beforeNote);
        }
        if (afterNote != null && !afterNote.isBlank()) {
            sb.append(" | after: ").append(afterNote);
        }
        String text = sb.toString();
        return text.length() <= 500 ? text : text.substring(0, 500);
    }

    public static String summarizeArg(Object arg) {
        if (arg == null) {
            return null;
        }
        if (arg instanceof Number || arg instanceof CharSequence || arg instanceof Enum<?>) {
            return String.valueOf(arg);
        }
        String simple = arg.getClass().getSimpleName();
        Long id = extractId(arg);
        if (id != null) {
            return simple + "(id=" + id + ")";
        }
        return simple;
    }

    private static Long extractId(Object target) {
        if (target == null) {
            return null;
        }
        try {
            Method getter = target.getClass().getMethod("getId");
            Object value = getter.invoke(target);
            if (value instanceof Long id) {
                return id;
            }
            if (value instanceof Number number) {
                return number.longValue();
            }
        } catch (ReflectiveOperationException ignored) {
            // not an identifiable entity/DTO
        }
        return null;
    }
}
