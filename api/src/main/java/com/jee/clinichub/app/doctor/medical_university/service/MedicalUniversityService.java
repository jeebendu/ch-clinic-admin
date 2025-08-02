package com.jee.clinichub.app.doctor.medical_university.service;

import java.util.List;

import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversityDto;
import com.jee.clinichub.global.model.Status;

public interface MedicalUniversityService {

    List<MedicalUniversityDto> getAllMedicalUniversity();

    Status saveOrUpdate(MedicalUniversityDto medicalUniversityDto);

    Status deleteById(Long id);

    List<MedicalUniversityDto> getMedicalUniversityByName(String name);

  

   
    
}
