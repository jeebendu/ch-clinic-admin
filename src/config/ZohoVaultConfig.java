
package com.clinichub.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "zoho.vault")
public class ZohoVaultConfig {
    
    private String baseUrl = "https://vault.zoho.com/api/json";
    private String authToken;
    private String secretsPath;
    private boolean enabled = false;
    private int cacheTimeoutMinutes = 30;
    private int maxRetries = 3;
    private int retryDelaySeconds = 2;
    
    // Getters and Setters
    public String getBaseUrl() {
        return baseUrl;
    }
    
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    public String getAuthToken() {
        return authToken;
    }
    
    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }
    
    public String getSecretsPath() {
        return secretsPath;
    }
    
    public void setSecretsPath(String secretsPath) {
        this.secretsPath = secretsPath;
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public int getCacheTimeoutMinutes() {
        return cacheTimeoutMinutes;
    }
    
    public void setCacheTimeoutMinutes(int cacheTimeoutMinutes) {
        this.cacheTimeoutMinutes = cacheTimeoutMinutes;
    }
    
    public int getMaxRetries() {
        return maxRetries;
    }
    
    public void setMaxRetries(int maxRetries) {
        this.maxRetries = maxRetries;
    }
    
    public int getRetryDelaySeconds() {
        return retryDelaySeconds;
    }
    
    public void setRetryDelaySeconds(int retryDelaySeconds) {
        this.retryDelaySeconds = retryDelaySeconds;
    }
}
