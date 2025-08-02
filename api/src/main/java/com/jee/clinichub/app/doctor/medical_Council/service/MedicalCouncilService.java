package com.jee.clinichub.app.doctor.medical_Council.service;

import java.util.List;

import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.global.model.Status;

public interface MedicalCouncilService {

    List<MedicalCouncilDto> getAllMedicalCouncil();

    Status saveOrUpdate(MedicalCouncilDto medicalCouncilDto);

    Status deleteById(Long id);

    List<MedicalCouncilDto> getMedicalCouncilsByName(String name);
    
}
