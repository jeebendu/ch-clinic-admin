package com.jee.clinichub.app.appointment.patientSymptoms.controller;

import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.appointment.patientSymptoms.model.PatientSymptomsDto;
import com.jee.clinichub.app.appointment.patientSymptoms.service.PatientSymptomsService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/patient/symptoms")
@RequiredArgsConstructor
public class PatientSymptomsController {

    private final PatientSymptomsService symptomsService;

    @PostMapping(value = "/saveOrUpdate")
    public PatientSymptomsDto saveOrUpdate(@RequestBody PatientSymptomsDto symptomsDto) {
        return symptomsService.saveOrUpdate(symptomsDto);
    }

    @GetMapping(value = "/id/{id}")
    public PatientSymptomsDto getById(@PathVariable Long id) {
        return symptomsService.getById(id);
    }

    @GetMapping(value = "/list")
    public List<PatientSymptomsDto> findAll() {
        return symptomsService.findAll();
    }

    @GetMapping(value = "/visit/id/{visitId}")
    public List<PatientSymptomsDto> findAllByVisitId(@PathVariable Long visitId) {
        return symptomsService.findAllByVisitId(visitId);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return symptomsService.deleteById(id);
    }
}
