package com.jee.clinichub.app.doctor.medical_Degree.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.medical_Degree.model.MedicalDegreeDto;
import com.jee.clinichub.app.doctor.medical_Degree.service.MedicalDegreeService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/public/medical/degree")
public class MedicalDegreePublicController {

    @Autowired
    private MedicalDegreeService medicalCouncilService;


    @GetMapping(value="/list/{name}")
    public List<MedicalDegreeDto> getMedicalDegreesByName(@PathVariable String name){
        return medicalCouncilService.getMedicalDegreesByName(name);
    }
    

    
}
