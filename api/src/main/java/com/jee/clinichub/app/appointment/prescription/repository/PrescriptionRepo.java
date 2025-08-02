package com.jee.clinichub.app.appointment.prescription.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.prescription.model.Prescription;

@Repository
public interface PrescriptionRepo extends JpaRepository<Prescription,Long>{

    Page<Prescription> findAllByVisit_patient_id(Pageable pageble, Long patientId);
    
}
