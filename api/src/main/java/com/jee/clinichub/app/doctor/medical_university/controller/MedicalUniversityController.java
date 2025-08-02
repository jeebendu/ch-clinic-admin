package com.jee.clinichub.app.doctor.medical_university.controller;



import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.app.doctor.medical_Council.service.MedicalCouncilService;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversityDto;
import com.jee.clinichub.app.doctor.medical_university.service.MedicalUniversityService;
import com.jee.clinichub.global.model.Status;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/medical/university")

public class MedicalUniversityController {

    @Autowired
    private MedicalUniversityService medicalUniversityService;


    @GetMapping(value="/list")
    public List<MedicalUniversityDto> getAllMedicalUniversity(){
        return medicalUniversityService.getAllMedicalUniversity();
    }
    

    
    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody   MedicalUniversityDto medicalUniversityDto){
        return medicalUniversityService.saveOrUpdate(medicalUniversityDto);
    }

    @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id){
        return medicalUniversityService.deleteById(id);
    }
    
}
