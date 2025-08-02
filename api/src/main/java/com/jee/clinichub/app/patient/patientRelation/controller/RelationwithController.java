package com.jee.clinichub.app.patient.patientRelation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.patient.patientRelation.model.RelationWithDTO;
import com.jee.clinichub.app.patient.patientRelation.service.RelationWithService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("v1/patient/relation-with")
@RequiredArgsConstructor
public class RelationwithController {
    

    private final RelationWithService relationWithService;

    @GetMapping(value="/id/{id}")
    public RelationWithDTO findById(@PathVariable Long id) {
        return relationWithService.findById(id);
    }

    @GetMapping(value="/list")
    public List<RelationWithDTO> findAll() {
        return relationWithService.findAll();
        }
        
    @GetMapping(value="/list/patient/{patientId}")
    public List<RelationWithDTO> findAllByPatientId(@PathVariable Long patientId) {
        return relationWithService.findAllByPatientId(patientId);
    }

    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody RelationWithDTO relationWithDTO) {
        return relationWithService.saveOrUpdate(relationWithDTO);
    }

    @DeleteMapping(value="/delete/{id}")
    public Status delete(@PathVariable Long id) {
       return relationWithService.delete(id);
    }





}
