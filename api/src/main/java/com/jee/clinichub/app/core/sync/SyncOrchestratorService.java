
package com.jee.clinichub.app.core.sync;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.service.AppointmentSyncService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class SyncOrchestratorService {
    
    @Autowired
    private AppointmentSyncService appointmentSyncService;
    
    @Autowired
    private CircuitBreakerService circuitBreakerService;
    
    @Autowired
    private SyncRetryService syncRetryService;
    
    @Autowired
    private SyncMonitoringService syncMonitoringService;
    
    @Value("${sync.max-retries:3}")
    private int maxRetries;
    
    public boolean syncAppointmentWithErrorHandling(AppointmentsDto appointmentDto, String tenantId) {
        try {
            // Check circuit breaker
            if (circuitBreakerService.isCircuitOpen(tenantId)) {
                log.warn("Circuit breaker is open for tenant: {}. Scheduling async retry.", tenantId);
                scheduleAsyncRetry(appointmentDto, tenantId);
                return false;
            }
            
            // Attempt synchronous sync
            appointmentSyncService.syncAppointmentToTenant(appointmentDto, tenantId);
            
            // Record success
            circuitBreakerService.recordSuccess(tenantId);
            syncMonitoringService.recordSyncSuccess(tenantId, "APPOINTMENT");
            
            log.info("Appointment sync successful for tenant: {}, GlobalAppointmentId: {}", 
                    tenantId, appointmentDto.getGlobalAppointmentId());
            return true;
            
        } catch (Exception e) {
            // Record failure
            circuitBreakerService.recordFailure(tenantId);
            syncMonitoringService.recordSyncFailure(tenantId, "APPOINTMENT", e.getMessage());
            
            log.error("Appointment sync failed for tenant: {}, GlobalAppointmentId: {}. Error: {}", 
                    tenantId, appointmentDto.getGlobalAppointmentId(), e.getMessage());
            
            // Schedule async retry
            scheduleAsyncRetry(appointmentDto, tenantId);
            
            return false;
        }
    }
    
    private void scheduleAsyncRetry(AppointmentsDto appointmentDto, String tenantId) {
        CompletableFuture<Boolean> retryFuture = syncRetryService.retryAppointmentSync(appointmentDto, tenantId, maxRetries);
        
        retryFuture.whenComplete((success, throwable) -> {
            if (throwable != null) {
                log.error("Async retry scheduling failed for tenant: {}", tenantId, throwable);
            } else if (success) {
                syncMonitoringService.recordSyncSuccess(tenantId, "APPOINTMENT_RETRY");
                log.info("Async retry successful for tenant: {}", tenantId);
            } else {
                log.error("All async retry attempts failed for tenant: {}", tenantId);
                // TODO: Add to dead letter queue for manual intervention
            }
        });
    }
    
    public boolean performCompensation(AppointmentsDto appointmentDto, String tenantId) {
        try {
            log.info("Performing compensation for failed sync - Tenant: {}, GlobalAppointmentId: {}", 
                    tenantId, appointmentDto.getGlobalAppointmentId());
            
            // Implement compensation logic based on your business rules
            // For example: revert changes, notify administrators, etc.
            
            return true;
        } catch (Exception e) {
            log.error("Compensation failed for tenant: {}, GlobalAppointmentId: {}. Error: {}", 
                    tenantId, appointmentDto.getGlobalAppointmentId(), e.getMessage());
            return false;
        }
    }




    
}
