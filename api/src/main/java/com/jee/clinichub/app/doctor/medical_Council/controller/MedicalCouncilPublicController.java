package com.jee.clinichub.app.doctor.medical_Council.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.app.doctor.medical_Council.service.MedicalCouncilService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/public/medical/council")
public class MedicalCouncilPublicController {

    @Autowired
    private MedicalCouncilService medicalCouncilService;


    @GetMapping(value="/list/{name}")
    public List<MedicalCouncilDto> getMedicalCouncilsByName(@PathVariable String name){
        return medicalCouncilService.getMedicalCouncilsByName(name);
    }
    

    
}
