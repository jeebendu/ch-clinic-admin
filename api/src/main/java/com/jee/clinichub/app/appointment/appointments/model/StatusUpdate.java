package com.jee.clinichub.app.appointment.appointments.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusUpdate {
    private AppointmentStatus status;
}
