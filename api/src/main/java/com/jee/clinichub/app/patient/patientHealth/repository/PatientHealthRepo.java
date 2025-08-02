package com.jee.clinichub.app.patient.patientHealth.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.patient.patientHealth.model.PatientHealth;

@Repository
public interface PatientHealthRepo extends JpaRepository<PatientHealth,Long> {

    List<PatientHealth> findByPatient_id(Long patientId);
    
}
