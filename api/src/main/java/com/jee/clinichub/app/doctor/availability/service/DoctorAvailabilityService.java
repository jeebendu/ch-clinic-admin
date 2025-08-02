package com.jee.clinichub.app.doctor.availability.service;

import java.util.List;

import com.jee.clinichub.app.doctor.availability.entity.DoctorAvailability;
import com.jee.clinichub.app.doctor.availability.entity.DoctorAvailabilityDTO;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface DoctorAvailabilityService {

    List<DoctorAvailabilityDTO> getAllAvailability();

    DoctorAvailability getAvailabilityById(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate(@Valid DoctorAvailabilityDTO availabilityDTO);
    
}
