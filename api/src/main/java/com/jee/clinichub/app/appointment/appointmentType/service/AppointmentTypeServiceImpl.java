package com.jee.clinichub.app.appointment.appointmentType.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;
import com.jee.clinichub.app.appointment.appointmentType.repository.AppointmentTypeRepository;

@Service(value = "appointTypeService")
public class AppointmentTypeServiceImpl implements AppointmentTypeService{

    @Autowired
	private AppointmentTypeRepository appointmentTypeRepository;
   
    @Override
  public List<AppointmentType> getAllType() {
		return appointmentTypeRepository.findAll();
	}
    
}
