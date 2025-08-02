package com.jee.clinichub.app.patient.patientServiceHandler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.patient.patientServiceHandler.model.PatientServiceHandler;


@Repository
public interface PatientServiceHandlerRepo extends JpaRepository<PatientServiceHandler,Long>{

   public  boolean existsByEnquiryservicetype_idAndPatient_idAndIdNot(Long id, Long id2, Long l);

public List<PatientServiceHandler> findAllByPatient_id(Long id);
    
}
