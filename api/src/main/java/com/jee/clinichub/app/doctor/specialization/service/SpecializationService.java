package com.jee.clinichub.app.doctor.specialization.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.doctor.specialization.model.SpecializationDoctorCount;
import com.jee.clinichub.app.doctor.specialization.model.SpecializationDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface SpecializationService {


    List<SpecializationDto> getAllSepcializationn();


    List<SpecializationDoctorCount> getAllSepcialization();

    SpecializationDto getById(Long id);

    Status saveOrUpdate(MultipartFile file,@Valid SpecializationDto specialization);

    Status deleteById(Long id);


    List<SpecializationDto> sepecilizationsByName(String name);

    // List<SpecializationDoctorCount> getAllSepcializationDoctorCount();
    
}
