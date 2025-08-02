
package com.jee.clinichub.app.core.sync;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.service.AppointmentSyncService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class SyncRetryService {
    
    @Autowired
    private AppointmentSyncService appointmentSyncService;
    
    @Autowired
    private CircuitBreakerService circuitBreakerService;
    
    @Async("taskExecutor")
    public CompletableFuture<Boolean> retryAppointmentSync(AppointmentsDto appointmentDto, String tenantId, int maxRetries) {
        return CompletableFuture.supplyAsync(() -> {
            for (int attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    if (circuitBreakerService.isCircuitOpen(tenantId)) {
                        log.warn("Circuit breaker is open for tenant: {}. Skipping retry attempt {}", tenantId, attempt);
                        continue;
                    }
                    
                    Thread.sleep(attempt * 1000L); // Exponential backoff
                    appointmentSyncService.syncAppointmentToTenant(appointmentDto, tenantId);
                    
                    circuitBreakerService.recordSuccess(tenantId);
                    log.info("Appointment sync retry successful for tenant: {} on attempt {}", tenantId, attempt);
                    return true;
                    
                } catch (Exception e) {
                    circuitBreakerService.recordFailure(tenantId);
                    log.error("Appointment sync retry failed for tenant: {} on attempt {}: {}", tenantId, attempt, e.getMessage());
                    
                    if (attempt == maxRetries) {
                        log.error("All retry attempts exhausted for appointment sync to tenant: {}", tenantId);
                        // TODO: Add to dead letter queue or manual intervention queue
                    }
                }
            }
            return false;
        });
    }
}
