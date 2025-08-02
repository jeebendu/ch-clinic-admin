
package com.jee.clinichub.app.core.sync;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class CircuitBreakerService {
    
    @Value("${sync.circuit-breaker.failure-threshold:5}")
    private int failureThreshold;
    
    @Value("${sync.circuit-breaker.timeout-minutes:5}")
    private int timeoutMinutes;
    
    private final ConcurrentHashMap<String, CircuitBreakerState> circuitStates = new ConcurrentHashMap<>();
    
    public boolean isCircuitOpen(String tenantId) {
        CircuitBreakerState state = circuitStates.get(tenantId);
        if (state == null) {
            return false;
        }
        
        if (state.getFailureCount().get() >= failureThreshold) {
            if (LocalDateTime.now().isAfter(state.getLastFailureTime().plusMinutes(timeoutMinutes))) {
                // Reset circuit after timeout
                state.getFailureCount().set(0);
                log.info("Circuit breaker reset for tenant: {}", tenantId);
                return false;
            }
            return true;
        }
        
        return false;
    }
    
    public void recordSuccess(String tenantId) {
        CircuitBreakerState state = circuitStates.computeIfAbsent(tenantId, k -> new CircuitBreakerState());
        state.getFailureCount().set(0);
        log.debug("Circuit breaker success recorded for tenant: {}", tenantId);
    }
    
    public void recordFailure(String tenantId) {
        CircuitBreakerState state = circuitStates.computeIfAbsent(tenantId, k -> new CircuitBreakerState());
        state.getFailureCount().incrementAndGet();
        state.setLastFailureTime(LocalDateTime.now());
        
        if (state.getFailureCount().get() >= failureThreshold) {
            log.warn("Circuit breaker opened for tenant: {} after {} failures", tenantId, state.getFailureCount().get());
        }
    }
    
    private static class CircuitBreakerState {
        private final AtomicInteger failureCount = new AtomicInteger(0);
        private LocalDateTime lastFailureTime = LocalDateTime.now();
        
        public AtomicInteger getFailureCount() {
            return failureCount;
        }
        
        public LocalDateTime getLastFailureTime() {
            return lastFailureTime;
        }
        
        public void setLastFailureTime(LocalDateTime lastFailureTime) {
            this.lastFailureTime = lastFailureTime;
        }
    }
}
