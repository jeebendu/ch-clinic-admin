package com.jee.clinichub.config;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.global.model.Status;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private static final ObjectMapper objectMapper = new ObjectMapper(); // Singleton ObjectMapper

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException, java.io.IOException {
        // Custom response for unauthenticated requests
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        Status errorStatus = new Status(false, "Unauthorized: Authentication token was either missing or invalid.");
        String jsonResponse = objectMapper.writeValueAsString(errorStatus); // Use the singleton ObjectMapper
        response.getWriter().write(jsonResponse);
    }
}