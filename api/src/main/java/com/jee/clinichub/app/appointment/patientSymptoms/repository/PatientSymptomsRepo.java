package com.jee.clinichub.app.appointment.patientSymptoms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.patientSymptoms.model.PatientSymptoms;

@Repository
public interface PatientSymptomsRepo extends JpaRepository<PatientSymptoms,Long>{

    Optional<PatientSymptoms> findAllByVisit_id(Long visitId);
    
}
