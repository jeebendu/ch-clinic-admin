package com.jee.clinichub.app.doctor.availability.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.availability.entity.DoctorAvailability;

@Repository
public interface DoctorAvailabilityRepo extends JpaRepository<DoctorAvailability,Long>{
    
}
