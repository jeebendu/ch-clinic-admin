
package com.jee.clinichub.app.appointment.appointments.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.jee.clinichub.app.appointment.appointments.service.AppointmentsService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
public class AppointmentBookedEventListener {
    
    @Autowired
    private AppointmentsService appointmentsService;
    
    @Async("taskExecutor")
    @EventListener
    public void handleAppointmentBookedEvent(AppointmentBookedEvent event) {
        try {
            log.info("Processing appointment booked event for appointment ID: {}", event.getAppointment().getId());
            
            // Add small delay to ensure transaction is committed
            Thread.sleep(500);
            
            // Retry mechanism for PDF generation
            byte[] pdfData = generatePdfWithRetry(event.getAppointment().getId(), 3);
            
            if (pdfData != null && pdfData.length > 0) {
                // Call the existing email sending method
                appointmentsService.sendAppointmentConfirmEmail(event.getAppointment(), pdfData);
                log.info("Appointment confirmation email sent successfully for appointment ID: {}", event.getAppointment().getId());
            } else {
                log.warn("PDF generation failed for appointment ID: {}, sending email without attachment", event.getAppointment().getId());
                appointmentsService.sendAppointmentConfirmEmail(event.getAppointment(), null);
            }
            
        } catch (Exception e) {
            log.error("Error processing appointment booked event for appointment ID: {}", event.getAppointment().getId(), e);
            
            // Try to send email without PDF as fallback
            try {
                appointmentsService.sendAppointmentConfirmEmail(event.getAppointment(), null);
                log.info("Fallback email sent without PDF for appointment ID: {}", event.getAppointment().getId());
            } catch (Exception emailException) {
                log.error("Failed to send fallback email for appointment ID: {}", event.getAppointment().getId(), emailException);
            }
        }
    }
    
    private byte[] generatePdfWithRetry(Long appointmentId, int maxRetries) {
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.debug("Attempting PDF generation for appointment ID: {}, attempt: {}", appointmentId, attempt);
                
                byte[] pdfData = appointmentsService.downloadAppointment(appointmentId);
                
                if (pdfData != null && pdfData.length > 0) {
                    log.info("PDF generated successfully for appointment ID: {} on attempt: {}", appointmentId, attempt);
                    return pdfData;
                }
                
                log.warn("PDF generation returned empty data for appointment ID: {} on attempt: {}", appointmentId, attempt);
                
                if (attempt < maxRetries) {
                    Thread.sleep(1000 * attempt); // Exponential backoff
                }
                
            } catch (Exception e) {
                log.error("PDF generation failed for appointment ID: {} on attempt: {}: {}", appointmentId, attempt, e.getMessage());
                
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(1000 * attempt); // Exponential backoff
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        log.error("Thread interrupted during retry delay for appointment ID: {}", appointmentId);
                        break;
                    }
                }
            }
        }
        
        log.error("All PDF generation attempts failed for appointment ID: {}", appointmentId);
        return null;
    }
}
