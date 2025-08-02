package com.jee.clinichub.global.tenant.service;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.List;

@Data
//@Component
@ConfigurationProperties(prefix = "cloudflare")
public class CloudflareProperties {
    private List<DomainConfig> domains;

    @Data
    public static class DomainConfig {
        private String domain;
        private String zoneId;
        private String token;
    }
}