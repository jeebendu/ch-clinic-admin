package com.jee.clinichub.app.appointment.appointments.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Temporal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentSearch {

@Temporal(TemporalType.TIMESTAMP)
private Date date;    
private String searchTerm;    

private List<Long> branches;
private List<Number> statuses;
private List<Long> doctors=new ArrayList<Long>();
private AppointmentStatus status;

private String value;
private String type;




}
