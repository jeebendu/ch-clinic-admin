package com.jee.clinichub.app.admin.clinic.clinicServiceMap.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jee.clinichub.app.admin.clinic.clinicServiceMap.model.ClinicAndServiceMapDto;
import com.jee.clinichub.app.admin.clinic.clinicServiceMap.service.ClinicAndServiceMapService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/v1/api/public/clinic-service")
public class ClinicServicePublicController {

    @Autowired
    private ClinicAndServiceMapService clinicServiceEnt;

    @GetMapping(path = "/branch/id/{id}")
    public List<ClinicAndServiceMapDto> getAllByBranchId(@PathVariable Long id) {
        return clinicServiceEnt.getAllByBranchId(id);
    }

}
