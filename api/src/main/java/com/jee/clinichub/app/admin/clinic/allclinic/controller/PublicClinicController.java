package com.jee.clinichub.app.admin.clinic.allclinic.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicPublicViewProj;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicSearch;
import com.jee.clinichub.app.admin.clinic.allclinic.service.ClinicService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/v1/clinic/public")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class PublicClinicController {

    private final ClinicService clinicService;

    @GetMapping(value = "/list")
    public List<Clinic> getAllClinics() {
        return clinicService.getAllClinics();
    }

    @GetMapping(value = "/id/{id}")
    public ClinicDto getById(@PathVariable Long id) {
        return clinicService.getById(id);
    }

    @PostMapping(value = "/filter")
    public Page<ClinicPublicViewProj> filterClinic(@RequestBody ClinicSearch search, Pageable pageable) {
        return clinicService.filterClinic(search, pageable);
    }

    @PostMapping(value = "/search/name")
    public List<ClinicDto> getByName(@RequestBody ClinicSearch search) {
        return clinicService.getByName(search);
    }

    @GetMapping(value = "/slug/{slug}")
    public ClinicDto findBySlug(@PathVariable String slug) {
        return clinicService.findBySlug(slug);
    }

}
