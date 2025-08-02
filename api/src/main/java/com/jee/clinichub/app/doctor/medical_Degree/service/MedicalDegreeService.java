package com.jee.clinichub.app.doctor.medical_Degree.service;

import java.util.List;

import com.jee.clinichub.app.doctor.medical_Degree.model.MedicalDegreeDto;
import com.jee.clinichub.global.model.Status;

public interface MedicalDegreeService {

    List<MedicalDegreeDto> getAllMedicalDegree();

    Status saveOrUpdate(MedicalDegreeDto medicalCouncilDto);

    Status deleteById(Long id);

    List<MedicalDegreeDto> getMedicalDegreesByName(String name);
    
}
