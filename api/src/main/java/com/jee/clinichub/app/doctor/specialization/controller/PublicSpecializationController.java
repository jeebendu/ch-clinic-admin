package com.jee.clinichub.app.doctor.specialization.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.doctor.specialization.model.SpecializationDoctorCount;
import com.jee.clinichub.app.doctor.specialization.model.SpecializationDto;
import com.jee.clinichub.app.doctor.specialization.service.SpecializationService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/public/doctor/specialization")
public class PublicSpecializationController {

    @Autowired
    private SpecializationService specializationService;

    @GetMapping("/list")
    public List<SpecializationDto> getAllSepcializationn() {
        return specializationService.getAllSepcializationn();
    }

    @GetMapping("/list/{name}")
    public List<SpecializationDto> sepecilizationsByName(@PathVariable String name) {
        return specializationService.sepecilizationsByName(name);
    }

    @GetMapping("/list/count")
    public List<SpecializationDoctorCount> getAllSepcialization() {
        return specializationService.getAllSepcialization();
    }

    @GetMapping(value = "/id/{id}")
    public SpecializationDto getById(@PathVariable Long id) {
        return specializationService.getById(id);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return specializationService.deleteById(id);
    }


}
