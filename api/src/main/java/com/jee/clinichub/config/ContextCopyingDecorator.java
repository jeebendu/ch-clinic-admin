
package com.jee.clinichub.config;

import java.util.Map;

import org.slf4j.MDC;
import org.springframework.core.task.TaskDecorator;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import com.jee.clinichub.global.tenant.context.TenantContextHolder;

public class ContextCopyingDecorator implements TaskDecorator {

    @Override
    public Runnable decorate(Runnable runnable) {
        RequestAttributes context = RequestContextHolder.getRequestAttributes(); // SAFE access
        String tenantId = TenantContextHolder.getCurrentTenant();
        Map<String, String> mdcContext = MDC.getCopyOfContextMap(); // Capture MDC context

        return () -> {
            try {
                if (context != null) {
                    RequestContextHolder.setRequestAttributes(context);
                }
                if (tenantId != null) {
                    TenantContextHolder.setCurrentTenant(tenantId);
                }
                if (mdcContext != null) {
                    MDC.setContextMap(mdcContext); // Restore MDC context
                }
                runnable.run();
            } finally {
                if (context != null) {
                    RequestContextHolder.resetRequestAttributes();
                }
                TenantContextHolder.clear();
            }
        };
    }
}
