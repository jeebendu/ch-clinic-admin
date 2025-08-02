package com.jee.clinichub.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;

import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

@Component
@Log4j2
public class SubdomainAndPublicPathRequestMatcher implements RequestMatcher {

	 private static final String SUBDOMAIN = "www2";
	    private static final String LOCALHOST = "localhost";

	    // Use array instead of List
	    private static final String[] PATH_PREFIXES = {
	        "/public",
	        "/api/v1/auth",
	        "/open-api"
	    };

	    @Override
	    public boolean matches(HttpServletRequest request) {
	        String origin = request.getHeader("Origin");
	        String requestURI = request.getRequestURI();
	        String appToken = request.getHeader("X-App-Token");
	        String userAgent = request.getHeader("User-Agent");

	        // Allow authenticated app requests
	        if (appToken != null && appToken.equals("3f4d9a7e-b6bc-43e5-b9ea-c39d354fe8b4")) {
	            //log.info("Request allowed for authenticated application");
	            return true;
	        }

	        // Check if URI starts with any path prefix
	        boolean pathMatches = false;
	        for (String prefix : PATH_PREFIXES) {
	            if (requestURI.startsWith(prefix)) {
	                pathMatches = true;
	                break;
	            }
	        }

	        // Check for origin or localhost and matching path
	        if (origin != null) {
	            String serverName = getServerNameFromOrigin(origin);
	            //log.info("Server Name: " + serverName);
	            boolean matches = (serverName.contains(SUBDOMAIN + ".") || serverName.equals(LOCALHOST)) && pathMatches;
	            //log.info("Matches: " + matches);
	            return matches;
	        } else if (request.getServerName().contains(LOCALHOST) && pathMatches) {
	            return true;
	        }

	        return false;
	    }

	    private String getServerNameFromOrigin(String origin) {
	        try {
	            java.net.URL url = new java.net.URL(origin);
	            return url.getHost();
	        } catch (java.net.MalformedURLException e) {
	            return "";
	        }
	    }

   
}
