package com.jee.clinichub.app.doctor.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.app.doctor.model.DoctorClinicMapProjection;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.model.DoctorProj;
import com.jee.clinichub.app.doctor.model.OnBordingDoctor;
import com.jee.clinichub.app.doctor.model.SearchDoctorView;
import com.jee.clinichub.app.doctor.service.DoctorService;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("v1/public/doctor")
public class DoctorPublicController {
   
    private final DoctorService doctorService;
    
  
    @GetMapping(value="/id/{id}")
    public DoctorDto getById(@PathVariable Long id ){
        return doctorService.getById(id);
    }
    
    @GetMapping("/slug/{slug}")
    public DoctorDto getDoctorBySlug(@PathVariable String slug) {
        return doctorService.findBySlug(slug);
    }

    @GetMapping(value="/branch/{id}")
    public List<DoctorDto> getDoctorsByBranchId(@PathVariable Long id ){
        return doctorService.getDoctorsByBranchId(id);
    }

       
    @PostMapping(value="/saveOnbording")
    public Status createObBordingDoctor(@RequestBody @Valid OnBordingDoctor doctor,Errors errors){
        return doctorService.createObBordingDoctor(doctor);
    }

        @PostMapping(value="/filter")
    public Page<DoctorClinicMapProjection> filterDoctorPublic(Pageable pageable,@RequestBody SearchDoctorView search){
        return doctorService.filterDoctorPublic(pageable,search);
    }

    @PostMapping(value="/search")
    public Page<DoctorProj> searchDoctor(Pageable pageable, @RequestBody Search search){
        return doctorService.searchDoctor(pageable,search);
    }



}
