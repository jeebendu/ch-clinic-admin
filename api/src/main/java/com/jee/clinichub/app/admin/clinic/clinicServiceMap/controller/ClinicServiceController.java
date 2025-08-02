package com.jee.clinichub.app.admin.clinic.clinicServiceMap.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.clinic.clinicServiceMap.model.ClinicAndServiceMapDto;
import com.jee.clinichub.app.admin.clinic.clinicServiceMap.service.ClinicAndServiceMapService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/v1/api/clinic-service")

public class ClinicServiceController {
     @Autowired
    private ClinicAndServiceMapService clinicAndServiceMapService;

    @GetMapping(value = "/list")
    public List<ClinicAndServiceMapDto> getAllService() {
        return clinicAndServiceMapService.getAllService();
    }

    @GetMapping(value = "/id/{id}")
    public ClinicAndServiceMapDto getById(@PathVariable Long id) {
        return clinicAndServiceMapService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status savePatient(@RequestBody ClinicAndServiceMapDto review) {
        return clinicAndServiceMapService.saveOrUpdate(review);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return clinicAndServiceMapService.deleteById(id);
    }

    @GetMapping(path = "/branch/id/{id}")
    public List<ClinicAndServiceMapDto> getAllByBranchId(@PathVariable Long id) {
        return clinicAndServiceMapService.getAllByBranchId(id);
    }

}
