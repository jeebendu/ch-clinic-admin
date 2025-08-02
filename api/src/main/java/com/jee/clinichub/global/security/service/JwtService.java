package com.jee.clinichub.global.security.service;

import org.springframework.security.core.userdetails.UserDetails;

import jakarta.servlet.http.HttpServletRequest;

public interface JwtService {
    
    String extractUserName(String token);

    String generateToken(UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);

	String extractTenant(String jwt);

	String getTenantId(HttpServletRequest req);
}
