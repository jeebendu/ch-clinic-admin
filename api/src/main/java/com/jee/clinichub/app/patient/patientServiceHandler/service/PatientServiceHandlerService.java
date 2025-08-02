package com.jee.clinichub.app.patient.patientServiceHandler.service;

import java.util.List;

import com.jee.clinichub.app.patient.patientServiceHandler.model.PatientServiceHandlerDTO;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface PatientServiceHandlerService {

    Status deleteById(Long id);

    Status saveOrUpdate(@Valid PatientServiceHandlerDTO service);

    PatientServiceHandlerDTO getById(Long id);

    List<PatientServiceHandlerDTO> getAllServiceHandler();

    List<PatientServiceHandlerDTO> getServicegeByPatientId(Long id);
    
}
