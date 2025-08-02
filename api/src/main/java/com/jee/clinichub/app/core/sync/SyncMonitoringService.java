
package com.jee.clinichub.app.core.sync;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class SyncMonitoringService {
    
    private final ConcurrentHashMap<String, SyncMetrics> tenantMetrics = new ConcurrentHashMap<>();
    
    public void recordSyncSuccess(String tenantId, String syncType) {
        SyncMetrics metrics = tenantMetrics.computeIfAbsent(tenantId, k -> new SyncMetrics());
        metrics.getSuccessCount().incrementAndGet();
        metrics.setLastSuccessTime(LocalDateTime.now());
        
        log.info("Sync success recorded - Tenant: {}, Type: {}, Total Success: {}", 
                tenantId, syncType, metrics.getSuccessCount().get());
    }
    
    public void recordSyncFailure(String tenantId, String syncType, String errorMessage) {
        SyncMetrics metrics = tenantMetrics.computeIfAbsent(tenantId, k -> new SyncMetrics());
        metrics.getFailureCount().incrementAndGet();
        metrics.setLastFailureTime(LocalDateTime.now());
        metrics.setLastErrorMessage(errorMessage);
        
        log.error("Sync failure recorded - Tenant: {}, Type: {}, Total Failures: {}, Error: {}", 
                tenantId, syncType, metrics.getFailureCount().get(), errorMessage);
        
        // Alert if failure rate is high
        checkFailureRate(tenantId, metrics);
    }
    
    private void checkFailureRate(String tenantId, SyncMetrics metrics) {
        long totalAttempts = metrics.getSuccessCount().get() + metrics.getFailureCount().get();
        if (totalAttempts > 10) { // Only check after at least 10 attempts
            double failureRate = (double) metrics.getFailureCount().get() / totalAttempts;
            if (failureRate > 0.5) { // Alert if failure rate > 50%
                log.warn("HIGH FAILURE RATE ALERT - Tenant: {}, Failure Rate: {}%", 
                        tenantId, String.format("%.2f", failureRate * 100));
                // TODO: Send alert to monitoring system
            }
        }
    }
    
    public SyncMetrics getMetrics(String tenantId) {
        return tenantMetrics.get(tenantId);
    }
    
    public static class SyncMetrics {
        private final AtomicLong successCount = new AtomicLong(0);
        private final AtomicLong failureCount = new AtomicLong(0);
        private LocalDateTime lastSuccessTime;
        private LocalDateTime lastFailureTime;
        private String lastErrorMessage;
        
        // Getters and setters
        public AtomicLong getSuccessCount() { return successCount; }
        public AtomicLong getFailureCount() { return failureCount; }
        public LocalDateTime getLastSuccessTime() { return lastSuccessTime; }
        public void setLastSuccessTime(LocalDateTime lastSuccessTime) { this.lastSuccessTime = lastSuccessTime; }
        public LocalDateTime getLastFailureTime() { return lastFailureTime; }
        public void setLastFailureTime(LocalDateTime lastFailureTime) { this.lastFailureTime = lastFailureTime; }
        public String getLastErrorMessage() { return lastErrorMessage; }
        public void setLastErrorMessage(String lastErrorMessage) { this.lastErrorMessage = lastErrorMessage; }
    }
}
