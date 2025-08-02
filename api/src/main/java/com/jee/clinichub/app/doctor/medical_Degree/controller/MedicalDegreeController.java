package com.jee.clinichub.app.doctor.medical_Degree.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.medical_Degree.model.MedicalDegreeDto;
import com.jee.clinichub.app.doctor.medical_Degree.service.MedicalDegreeService;
import com.jee.clinichub.global.model.Status;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/medical/degree")
public class MedicalDegreeController {

    @Autowired
    private MedicalDegreeService medicalDegreeService;


    @GetMapping(value="/list")
    public List<MedicalDegreeDto> getAllMedicalDegree(){
        return medicalDegreeService.getAllMedicalDegree();
    }
  
    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody   MedicalDegreeDto medicalDegreeDto){
        return medicalDegreeService.saveOrUpdate(medicalDegreeDto);
    }

    @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id){
        return medicalDegreeService.deleteById(id);
    }
    
}
