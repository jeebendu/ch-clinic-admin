
package com.jee.clinichub.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.global.context.TimeZoneContextHolder;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.service.JwtService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;


@Log4j2
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    
    @Value("${jwt.header.branch}")
    public String HEADER_BRANCH;

    @Value("${app.default-tenant}")
    public String defaultTenant;
	
    @Autowired private JwtService jwtService;
    
    @Resource(name = "userService")
    @Autowired private UserDetailsService userDetailsService;
    
    @Autowired
    private BranchService branchService;

    @Autowired
    private SubdomainAndPublicPathRequestMatcher subdomainAndPublicPathRequestMatcher;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    
    /**
     * Filters the incoming request and response for authentication using JWT.
     * If the request does not contain a valid JWT token, the filter chain is continued without authentication.
     * If the request contains a valid JWT token, the user is authenticated and the filter chain is continued.
     *
     * @param request      the incoming HTTP request
     * @param response     the outgoing HTTP response
     * @param filterChain the filter chain to be executed
     * @throws ServletException if an error occurs while processing the request
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Get the client's time zone
        ZoneId clientTimeZone = getClientTimeZone(request);
        TimeZoneContextHolder.setTimeZone(clientTimeZone);
    
        //signin, signup, verifyToken, forgotPassword
        setTenantForPublicPages(request);
    
        if (StringUtils.isEmpty(authHeader) || !StringUtils.startsWith(authHeader, "Bearer ")) {
        	this.getBranchByReq(request).ifPresent(BranchContextHolder::setCurrentBranch);
            filterChain.doFilter(request, response);
            return;
        }
    
        String jwt = authHeader.substring(7);
        
        try {
            String userEmail = jwtService.extractUserName(jwt);
        
            if (StringUtils.isEmpty(userEmail) || SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }
        
            authenticateUser(jwt, userEmail, request);
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired: {}", e.getMessage());
            handleJwtException(response, "Your session has expired. Please login again.", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (MalformedJwtException e) {
            log.warn("JWT token is malformed: {}", e.getMessage());
            handleJwtException(response, "Invalid token format. Please login again.", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported: {}", e.getMessage());
            handleJwtException(response, "Unsupported token type. Please login again.", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (SignatureException e) {
            log.warn("JWT signature validation failed: {}", e.getMessage());
            handleJwtException(response, "Invalid token signature. Please login again.", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (IllegalArgumentException e) {
            log.warn("JWT token compact of handler are invalid: {}", e.getMessage());
            handleJwtException(response, "Invalid token. Please login again.", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            log.error("Unexpected error during JWT processing: {}", e.getMessage());
            handleJwtException(response, "Authentication failed. Please login again.", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
    }

    /**
     * Handle JWT exceptions by sending appropriate error response
     */
    private void handleJwtException(HttpServletResponse response, String message, int statusCode) throws IOException {
        response.setContentType("application/json");
        response.setStatus(statusCode);
        
        Status errorStatus = new Status(false, message);
        String jsonResponse = objectMapper.writeValueAsString(errorStatus);
        response.getWriter().write(jsonResponse);
    }
    
    /**
     * Authenticates the user using the provided JWT token and user email.
     * Sets the current tenant, loads the user details, validates the token,
     * sets the authentication token in the security context, and sets the current branch.
     *
     * @param jwt      the JWT token
     * @param userEmail the user email
     * @param request  the HTTP servlet request
     */
    private void authenticateUser(String jwt, String userEmail, HttpServletRequest request) {

        String loggedInTenant = jwtService.extractTenant(jwt);
        if (loggedInTenant == null || loggedInTenant.isBlank()) {
            loggedInTenant = defaultTenant; // fallback to "master" or your configured default
        }
        TenantContextHolder.setCurrentTenant(loggedInTenant);
        // Set tenant context BEFORE any DB access
        //log.info("Tenant set before loading user details: {}", TenantContextHolder.getCurrentTenant());

        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
    
        if (!jwtService.isTokenValid(jwt, userDetails)) {
            return;
        }
    
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
    
        this.getBranchByReq(request).ifPresent(BranchContextHolder::setCurrentBranch);
    }

    /**
     * Sets the tenant for public pages based on the request.
     * Prioritizes explicit tenant header over token extraction and default fallback.
     *
     * @param request the HttpServletRequest object representing the current request
     */
    private void setTenantForPublicPages(HttpServletRequest request) {
        final String requestURI = request.getRequestURI();
        String tenant = request.getHeader("Tenant");
        
        log.debug("Initial tenant from header: {}", tenant);
        
        // Priority 1: Explicit tenant header - if present, use it and return
        if (tenant != null && !tenant.isBlank()) {
            log.debug("Setting tenant from header: {}", tenant);
            TenantContextHolder.setCurrentTenant(tenant);
            //return;
        }
        
        // Priority 2: Token extraction for verifyToken endpoint
        if (requestURI.contains("/api/v1/auth/verifyToken")) {
            try {
                String encodedToken = requestURI.substring(requestURI.lastIndexOf('/') + 1);
                byte[] decodedBytes = Base64.getDecoder().decode(encodedToken);
                String decodedString = new String(decodedBytes, StandardCharsets.UTF_8);
                String[] tokenWithTenant = decodedString.split("::");
                if (tokenWithTenant.length > 1) {
                    tenant = tokenWithTenant[1];
                    log.debug("Setting tenant from token extraction: {}", tenant);
                    TenantContextHolder.setCurrentTenant(tenant);
                    //return;
                }
            } catch (IllegalArgumentException e) {
                log.debug("Failed to extract tenant from token, falling back to default");
            }
        }
        
        // Priority 3: Default tenant for subdomain/public paths (only if no explicit tenant was found)
        if (tenant == null && subdomainAndPublicPathRequestMatcher.matches(request)) {
            log.debug("Setting default tenant for public path: {}", defaultTenant);
            TenantContextHolder.setCurrentTenant(defaultTenant);
        }
    }

    /**
     * Retrieves the branch associated with the request.
     *
     * @param request the HttpServletRequest object representing the incoming request
     * @return an Optional containing the Branch object if found, or an empty Optional if not found
     */
    private Optional<Branch> getBranchByReq(HttpServletRequest request) {
        try {
            String headerBranchId = request.getHeader(HEADER_BRANCH);
            if (headerBranchId != null) {
                Long branchId = Long.parseLong(headerBranchId);
                return branchService.findById(branchId);
            } else if (subdomainAndPublicPathRequestMatcher.matches(request)) {
                // Set tenant context BEFORE any DB access
                //log.info("Tenant getBranchByReq: {}", TenantContextHolder.getCurrentTenant());

                return branchService.getPrimaryBranch();
            }
        } catch (NumberFormatException e) {
            log.error("Error parsing branch ID from header: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage());
        }
        return Optional.empty();
    }

    private ZoneId getClientTimeZone(HttpServletRequest request) {
        String timeZoneHeader = request.getHeader("TimeZone");
        ZoneId clientTimeZone;
        if (timeZoneHeader != null && !timeZoneHeader.isEmpty()) {
            try {
                clientTimeZone = ZoneId.of(timeZoneHeader);
            } catch (Exception e) {
                // Handle invalid time zone ID
                log.info("Invalid TimeZone header: " + timeZoneHeader + ". Falling back to system default time zone.");
                clientTimeZone = ZoneId.systemDefault();
            }
        } else {
            // Fall back to system default time zone if TimeZone header is not present
            clientTimeZone = ZoneId.systemDefault();
        }
        
        return clientTimeZone;
    }
}
