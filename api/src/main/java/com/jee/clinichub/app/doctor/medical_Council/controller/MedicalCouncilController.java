package com.jee.clinichub.app.doctor.medical_Council.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.app.doctor.medical_Council.service.MedicalCouncilService;
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
@RequestMapping("v1/medical/council")
public class MedicalCouncilController {

    @Autowired
    private MedicalCouncilService medicalCouncilService;


    @GetMapping(value="/list")
    public List<MedicalCouncilDto> getAllMedicalCouncil(){
        return medicalCouncilService.getAllMedicalCouncil();
    }
    

    
    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody   MedicalCouncilDto medicalCouncilDto){
        return medicalCouncilService.saveOrUpdate(medicalCouncilDto);
    }

    @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id){
        return medicalCouncilService.deleteById(id);
    }
    
}
