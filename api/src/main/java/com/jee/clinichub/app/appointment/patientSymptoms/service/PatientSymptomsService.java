package com.jee.clinichub.app.appointment.patientSymptoms.service;

import java.util.List;

import com.jee.clinichub.app.appointment.patientSymptoms.model.PatientSymptomsDto;
import com.jee.clinichub.global.model.Status;

public interface PatientSymptomsService {

    PatientSymptomsDto saveOrUpdate(PatientSymptomsDto symptomsDto);

    PatientSymptomsDto getById(Long id);

    List<PatientSymptomsDto> findAll();

    List<PatientSymptomsDto> findAllByVisitId(Long visitId);

    Status deleteById(Long id);
    
}
