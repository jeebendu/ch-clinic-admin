package com.jee.clinichub.app.doctor.medical_college.service;
import java.util.List;
import com.jee.clinichub.app.doctor.medical_college.model.MedicalCollegeDto;
import com.jee.clinichub.global.model.Status;

public interface MedicalCollegeService {
    
Status saveOrUpdate(MedicalCollegeDto medicalCollegeDto);

    Status deleteById(Long id);

    List<MedicalCollegeDto> getAllMedicalCollege();

    List<MedicalCollegeDto> getMedicalCollegeByName(String name);

    
    
}
