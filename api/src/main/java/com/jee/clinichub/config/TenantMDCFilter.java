
package com.jee.clinichub.config;

import java.io.IOException;

import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Order(2) // Must come after TenantFilter
public class TenantMDCFilter extends OncePerRequestFilter {

    private static final String TENANT_MDC_KEY = "tenant";
    private static final String DEFAULT_TENANT_VALUE = "MASTER";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // Get tenant from TenantContextHolder
            String tenant = TenantContextHolder.getCurrentTenant();
            
            // Set tenant in MDC for logging
            if (tenant != null && !tenant.isEmpty()) {
                MDC.put(TENANT_MDC_KEY, tenant.toUpperCase());
            } else {
                MDC.put(TENANT_MDC_KEY, DEFAULT_TENANT_VALUE);
            }

            filterChain.doFilter(request, response);
        } finally {
            // Clean up MDC
            MDC.remove(TENANT_MDC_KEY);
        }
    }
}
