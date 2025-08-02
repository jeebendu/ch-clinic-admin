
package com.jee.clinichub.global.tenant.context;

/**
 * @author Jeebendu
 * The context holder implementation is a container that stores the current context as a ThreadLocal reference.
 */
public class TenantContextHolder {

    private static final ThreadLocal<String> contextHolder = new ThreadLocal<>();
    
    public static ThreadLocal<String> getTenant() {
        return contextHolder;
    }

    public static void setCurrentTenant(String tenant) {
        contextHolder.set(tenant);
        // Automatically update MDC when tenant context changes
        TenantMDC.setTenant(tenant);
    }

    public static String getCurrentTenant() {
        return contextHolder.get();
    }

    public static void clear() {
        contextHolder.remove();
        // Clear MDC when context is cleared
        TenantMDC.clear();
    }
}
