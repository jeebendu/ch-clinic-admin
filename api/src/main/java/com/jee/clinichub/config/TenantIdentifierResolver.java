package com.jee.clinichub.config;

import java.security.Principal;
import java.util.Optional;
import java.util.function.Predicate;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {

    @Value("${app.default-tenant}")
    public String defaultTenant;
    
    public static final String DEFAULT_TENANT = "master";

    @Override
    public String resolveCurrentTenantIdentifier() {
    	 // Priority 1: Tenant explicitly set (e.g., during signup/public calls)
        String tenant = TenantContextHolder.getCurrentTenant();

        if (tenant != null && !tenant.isBlank()) {
            return tenant;
        }
        // Priority 2: Tenant from security context (e.g., during login)
    	tenant = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Predicate.not(authentication -> authentication instanceof AnonymousAuthenticationToken))
                .map(Principal:: getName)
                .orElse(defaultTenant);
    	
    	String signupTenant = TenantContextHolder.getCurrentTenant();
    	if(signupTenant!=null && !signupTenant.equalsIgnoreCase(defaultTenant)) {
    		tenant = signupTenant;
    	}
        //log.info("Tenant in resolveCurrentTenantIdentifier: {}", TenantContextHolder.getCurrentTenant());
  
        return tenant;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
