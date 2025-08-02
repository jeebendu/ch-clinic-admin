package com.jee.clinichub.app.admin.clinic.clinicFacility.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacility;

public interface ClinicFacilityRepo extends JpaRepository<ClinicFacility, Long> {
    
}
