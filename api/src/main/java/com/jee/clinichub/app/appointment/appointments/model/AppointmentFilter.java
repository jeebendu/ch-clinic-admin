package com.jee.clinichub.app.appointment.appointments.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentFilter {
    
   private List<Long> branches;
   private List<AppointmentStatus> statuses;
   private String searchTerm;
   private List<String> gender;
}
