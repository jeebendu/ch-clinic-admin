package com.jee.clinichub.app.patient.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.model.PatientOptProj;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient.model.PatientSearch;
import com.jee.clinichub.app.patient.service.PatientService;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("v1/public/patient")
public class PatientPublicController {

    @Autowired
    private PatientService patientService;

    @PostMapping(value = "/register")
    public Status registerPatient(@RequestBody PatientDto patient) {
        return patientService.registerPatients(patient);
    }

}
