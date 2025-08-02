package com.jee.clinichub.app.patient_documents.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient_documents.model.PatientDocuments;

@Repository
public interface PatientDocumentsRepository  extends JpaRepository <PatientDocuments, Long>{

	Optional<PatientDocuments> findByPatient_id(Long id);

}
