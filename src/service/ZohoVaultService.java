
package com.clinichub.service;

import com.clinichub.config.ZohoVaultConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ZohoVaultService {
    
    private static final Logger logger = LoggerFactory.getLogger(ZohoVaultService.class);
    
    @Autowired
    private ZohoVaultConfig vaultConfig;
    
    @Autowired
    private RestTemplate restTemplate;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, CachedSecret> secretCache = new ConcurrentHashMap<>();
    
    public String getSecret(String secretName) {
        if (!vaultConfig.isEnabled()) {
            logger.warn("Zoho Vault is disabled, falling back to environment variables");
            return System.getenv(secretName);
        }
        
        // Check cache first
        CachedSecret cachedSecret = secretCache.get(secretName);
        if (cachedSecret != null && !cachedSecret.isExpired()) {
            logger.debug("Retrieved secret '{}' from cache", secretName);
            return cachedSecret.getValue();
        }
        
        // Fetch from Zoho Vault
        String secretValue = fetchSecretFromVault(secretName);
        if (secretValue != null) {
            // Cache the secret
            secretCache.put(secretName, new CachedSecret(secretValue, vaultConfig.getCacheTimeoutMinutes()));
            logger.info("Successfully retrieved and cached secret '{}'", secretName);
            return secretValue;
        }
        
        logger.error("Failed to retrieve secret '{}' from Zoho Vault", secretName);
        return null;
    }
    
    private String fetchSecretFromVault(String secretName) {
        String url = vaultConfig.getBaseUrl() + "/secrets/" + secretName;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(vaultConfig.getAuthToken());
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        for (int attempt = 1; attempt <= vaultConfig.getMaxRetries(); attempt++) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class
                );
                
                if (response.getStatusCode() == HttpStatus.OK) {
                    return parseSecretFromResponse(response.getBody());
                }
                
                logger.warn("Attempt {} failed with status: {}", attempt, response.getStatusCode());
                
            } catch (RestClientException e) {
                logger.error("Attempt {} failed with exception: {}", attempt, e.getMessage());
                
                if (attempt < vaultConfig.getMaxRetries()) {
                    try {
                        Thread.sleep(vaultConfig.getRetryDelaySeconds() * 1000L * attempt);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        logger.error("Interrupted while waiting for retry");
                        break;
                    }
                }
            }
        }
        
        return null;
    }
    
    private String parseSecretFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode secretNode = root.path("data").path("secret");
            
            if (!secretNode.isMissingNode()) {
                return secretNode.asText();
            }
            
            logger.error("Secret not found in response structure");
            return null;
            
        } catch (Exception e) {
            logger.error("Error parsing secret response: {}", e.getMessage());
            return null;
        }
    }
    
    public void clearCache() {
        secretCache.clear();
        logger.info("Secret cache cleared");
    }
    
    public boolean isVaultHealthy() {
        try {
            String testUrl = vaultConfig.getBaseUrl() + "/health";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(vaultConfig.getAuthToken());
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                testUrl, HttpMethod.GET, entity, String.class
            );
            
            return response.getStatusCode() == HttpStatus.OK;
            
        } catch (Exception e) {
            logger.error("Vault health check failed: {}", e.getMessage());
            return false;
        }
    }
    
    private static class CachedSecret {
        private final String value;
        private final LocalDateTime expiry;
        
        public CachedSecret(String value, int timeoutMinutes) {
            this.value = value;
            this.expiry = LocalDateTime.now().plusMinutes(timeoutMinutes);
        }
        
        public String getValue() {
            return value;
        }
        
        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiry);
        }
    }
}
