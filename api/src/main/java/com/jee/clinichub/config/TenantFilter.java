
package com.jee.clinichub.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jee.clinichub.global.security.service.JwtService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
//@Component
//@Order(1) // Must come before Spring Security
public class TenantFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Value("${app.default-tenant}")
    private String defaultTenant;

    public TenantFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String tenant = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            tenant = jwtService.extractTenant(jwt);  // assumes tenant = aud claim
        }

        // If no tenant found in JWT, extract from hostname
        if (tenant == null || tenant.isEmpty()) {
            String hostname = request.getServerName();
            if (hostname != null && hostname.contains(".")) {
                // Extract subdomain from hostname (e.g., tenant.domain.com -> tenant)
                tenant = hostname.split("\\.")[0];
                
                // If we're on localhost, use default tenant
                if (hostname.equals("localhost")) {
                    tenant = defaultTenant;
                }
            }
        }

        // Set tenant context if we found one
        if (tenant != null && !tenant.isEmpty()) {
            log.debug("Setting tenant context to: {}", tenant);
            TenantContextHolder.setCurrentTenant(tenant);
        } else {
            // Fall back to default tenant
            log.debug("No tenant found, using default tenant: {}", defaultTenant);
            TenantContextHolder.setCurrentTenant(defaultTenant);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            log.debug("Clearing tenant context, was: {}", TenantContextHolder.getCurrentTenant());
            TenantContextHolder.clear(); // Clean up thread-local
        }
    }
}
