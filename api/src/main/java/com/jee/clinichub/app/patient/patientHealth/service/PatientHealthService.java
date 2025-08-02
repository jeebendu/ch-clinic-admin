package com.jee.clinichub.app.patient.patientHealth.service;



import java.util.List;

import com.jee.clinichub.app.patient.patientHealth.model.PatientHealthDTO;
import com.jee.clinichub.global.model.Status;

public interface PatientHealthService {

    List<PatientHealthDTO> findByPatientId(Long patientId);

    Status saveOrUpdate(PatientHealthDTO patientHealthDTO);

    Status delete(Long id);
    
}
