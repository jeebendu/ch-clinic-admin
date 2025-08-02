
package com.jee.clinichub.global.tenant.context;

import org.slf4j.MDC;

/**
 * Utility class for managing tenant context in MDC for logging
 */
public class TenantMDC {

    private static final String TENANT_MDC_KEY = "tenant";
    private static final String DEFAULT_TENANT_VALUE = "MASTER";

    /**
     * Set tenant in MDC
     */
    public static void setTenant(String tenant) {
        if (tenant != null && !tenant.isEmpty()) {
            MDC.put(TENANT_MDC_KEY, tenant.toUpperCase());
        } else {
            MDC.put(TENANT_MDC_KEY, DEFAULT_TENANT_VALUE);
        }
    }

    /**
     * Get tenant from MDC
     */
    public static String getTenant() {
        return MDC.get(TENANT_MDC_KEY);
    }

    /**
     * Clear tenant from MDC
     */
    public static void clear() {
        MDC.remove(TENANT_MDC_KEY);
    }

    /**
     * Execute a runnable with tenant context in MDC
     */
    public static void executeWithTenant(String tenant, Runnable runnable) {
        String originalTenant = getTenant();
        try {
            setTenant(tenant);
            runnable.run();
        } finally {
            if (originalTenant != null) {
                setTenant(originalTenant);
            } else {
                clear();
            }
        }
    }
}
