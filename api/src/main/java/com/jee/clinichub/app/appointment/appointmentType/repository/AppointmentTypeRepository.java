package com.jee.clinichub.app.appointment.appointmentType.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;

@Repository
public interface AppointmentTypeRepository extends JpaRepository<AppointmentType, Long> {

    List<AppointmentType> findAll();

   
    
}
