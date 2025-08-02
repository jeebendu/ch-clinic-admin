
package com.jee.clinichub.app.appointment.appointments.event;

import org.springframework.context.ApplicationEvent;

import com.jee.clinichub.app.appointment.appointments.model.Appointments;

public class AppointmentBookedEvent extends ApplicationEvent {
    
    private final Appointments appointment;
    
    public AppointmentBookedEvent(Object source, Appointments appointment) {
        super(source);
        this.appointment = appointment;
    }
    
    public Appointments getAppointment() {
        return appointment;
    }
}
