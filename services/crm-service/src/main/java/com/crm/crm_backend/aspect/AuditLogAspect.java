package com.crm.crm_backend.aspect;

import com.crm.crm_backend.model.entity.AuditTrail;
import com.crm.crm_backend.model.enums.AuditAction;
import com.crm.crm_backend.model.enums.AuditModule;
import com.crm.crm_backend.service.core.AuditTrailService;
import com.crm.crm_backend.util.helper.AuditUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogAspect {

    private static final ThreadLocal<Boolean> AUDITING = ThreadLocal.withInitial(() -> false);

    private final AuditTrailService auditTrailService;

    @AfterReturning(
            pointcut = "execution(* com.crm.crm_backend.service.core.*.create*(..)) "
                    + "&& !within(com.crm.crm_backend.service.core.AuditTrailService)",
            returning = "result")
    public void auditCreate(JoinPoint joinPoint, Object result) {
        saveAudit(joinPoint, result, AuditAction.CREATE, null, AuditUtils.summarizeArg(result));
    }

    @AfterReturning(
            pointcut = "execution(* com.crm.crm_backend.service.core.*.update*(..)) "
                    + "&& !within(com.crm.crm_backend.service.core.AuditTrailService)",
            returning = "result")
    public void auditUpdate(JoinPoint joinPoint, Object result) {
        Object[] args = joinPoint.getArgs();
        String before = args != null && args.length > 0 ? AuditUtils.summarizeArg(args[0]) : null;
        saveAudit(joinPoint, result, AuditAction.UPDATE, before, AuditUtils.summarizeArg(result));
    }

    @AfterReturning(
            pointcut = "execution(* com.crm.crm_backend.service.core.*.delete*(..)) "
                    + "&& !within(com.crm.crm_backend.service.core.AuditTrailService)")
    public void auditDelete(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        String before = args != null && args.length > 0 ? AuditUtils.summarizeArg(args[0]) : null;
        saveAudit(joinPoint, null, AuditAction.DELETE, before, null);
    }

    @AfterReturning(
            pointcut = "execution(* com.crm.crm_backend.service.core.*.accept*(..)) "
                    + "|| execution(* com.crm.crm_backend.service.core.*.confirm*(..)) "
                    + "|| execution(* com.crm.crm_backend.service.core.*.convert*(..)) "
                    + "|| execution(* com.crm.crm_backend.service.core.*.activate*(..)) "
                    + "|| execution(* com.crm.crm_backend.service.core.*.complete*(..)) "
                    + "|| execution(* com.crm.crm_backend.service.core.*.cancel*(..)) "
                    + "|| execution(* com.crm.crm_backend.service.core.*.changeStatus(..))",
            returning = "result")
    public void auditLifecycle(JoinPoint joinPoint, Object result) {
        String method = joinPoint.getSignature().getName().toLowerCase();
        AuditAction action = method.contains("accept") || method.contains("confirm")
                || method.contains("approve")
                ? AuditAction.APPROVE
                : AuditAction.UPDATE;
        Object[] args = joinPoint.getArgs();
        String before = args != null && args.length > 0 ? AuditUtils.summarizeArg(args[0]) : null;
        String after = args != null && args.length > 1
                ? AuditUtils.summarizeArg(args[1])
                : AuditUtils.summarizeArg(result);
        saveAudit(joinPoint, result, action, before, after);
    }

    private void saveAudit(
            JoinPoint joinPoint,
            Object result,
            AuditAction action,
            String beforeNote,
            String afterNote) {

        if (Boolean.TRUE.equals(AUDITING.get())) {
            return;
        }

        AUDITING.set(true);
        try {
            String serviceName = joinPoint.getTarget().getClass().getSimpleName();
            String entityName = serviceName.replace("Service", "");
            Long entityId = AuditUtils.resolveEntityId(result, joinPoint.getArgs());

            AuditTrail auditTrail = AuditTrail.builder()
                    .module(resolveModule(serviceName))
                    .action(action)
                    .entityId(entityId)
                    .entityName(entityName)
                    .performedBy(AuditUtils.currentUsername())
                    .performedAt(LocalDateTime.now())
                    .description(AuditUtils.buildDescription(
                            action.name(), entityName, entityId, beforeNote, afterNote))
                    .ipAddress(AuditUtils.clientIp())
                    .build();

            auditTrailService.save(auditTrail);
            log.debug("Audit saved: {} {} #{} by {}",
                    action, entityName, entityId, auditTrail.getPerformedBy());
        } finally {
            AUDITING.remove();
        }
    }

    private AuditModule resolveModule(String serviceName) {
        if (serviceName.contains("Customer")) {
            return AuditModule.CUSTOMER;
        }
        if (serviceName.contains("Lead")) {
            return AuditModule.LEAD;
        }
        if (serviceName.contains("Opportunity")) {
            return AuditModule.OPPORTUNITY;
        }
        if (serviceName.contains("Interaction")) {
            return AuditModule.INTERACTION;
        }
        if (serviceName.contains("Campaign")) {
            return AuditModule.CAMPAIGN;
        }
        if (serviceName.contains("Quotation")) {
            return AuditModule.QUOTATION;
        }
        if (serviceName.contains("SalesOrder")) {
            return AuditModule.SALES_ORDER;
        }
        if (serviceName.contains("Invoice")) {
            return AuditModule.INVOICE;
        }
        if (serviceName.contains("Payment")) {
            return AuditModule.PAYMENT;
        }
        if (serviceName.contains("Segment")) {
            return AuditModule.SEGMENT;
        }
        return AuditModule.DASHBOARD;
    }
}
