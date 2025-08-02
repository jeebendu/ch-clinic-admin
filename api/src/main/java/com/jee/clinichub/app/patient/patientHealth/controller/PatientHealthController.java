package com.jee.clinichub.app.patient.patientHealth.controller;


import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.patient.patientHealth.model.PatientHealthDTO;
import com.jee.clinichub.app.patient.patientHealth.service.PatientHealthService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("v1/patient-health")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PatientHealthController {

    private final PatientHealthService patientHealthService;

        
    @GetMapping(value="/patient/{patientId}")
    public List<PatientHealthDTO> findByPatientId(@PathVariable Long patientId) {
        return patientHealthService.findByPatientId(patientId);
    }

    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody PatientHealthDTO patientHealthDTO) {
        return patientHealthService.saveOrUpdate(patientHealthDTO);
    }

    @DeleteMapping(value="/delete/{id}")
    public Status delete(@PathVariable Long id) {
       return patientHealthService.delete(id);
    }


    
}
