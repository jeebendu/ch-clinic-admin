
package com.clinichub.config;

import com.clinichub.service.ZohoVaultService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class SecretsConfiguration {
    
    private static final Logger logger = LoggerFactory.getLogger(SecretsConfiguration.class);
    
    @Autowired
    private ZohoVaultService vaultService;
    
    @Autowired
    private ConfigurableEnvironment environment;
    
    private static final String[] REQUIRED_SECRETS = {
        "SPRING_DATASOURCE_URL",
        "SPRING_DATASOURCE_PASSWORD",
        "DB_USER",
        "SPRING_PORT",
        "SPRING_PROFILES_ACTIVE"
    };
    
    @EventListener(ApplicationReadyEvent.class)
    public void loadSecretsFromVault() {
        logger.info("Loading secrets from Zoho Vault...");
        
        Map<String, Object> vaultSecrets = new HashMap<>();
        
        for (String secretName : REQUIRED_SECRETS) {
            String secretValue = vaultService.getSecret(secretName);
            
            if (secretValue != null) {
                vaultSecrets.put(secretName.toLowerCase().replace('_', '.'), secretValue);
                logger.info("Loaded secret: {}", secretName);
            } else {
                logger.warn("Failed to load secret: {}", secretName);
                // Fallback to environment variable
                String envValue = System.getenv(secretName);
                if (envValue != null) {
                    vaultSecrets.put(secretName.toLowerCase().replace('_', '.'), envValue);
                    logger.info("Using environment fallback for: {}", secretName);
                }
            }
        }
        
        // Add vault secrets to Spring environment
        if (!vaultSecrets.isEmpty()) {
            MapPropertySource vaultPropertySource = new MapPropertySource("vault", vaultSecrets);
            environment.getPropertySources().addFirst(vaultPropertySource);
            logger.info("Added {} secrets to Spring environment", vaultSecrets.size());
        }
    }
}
