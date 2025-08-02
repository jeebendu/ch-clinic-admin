package com.jee.clinichub.app.doctor.medicalCourse.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourseDto;
import com.jee.clinichub.app.doctor.medicalCourse.service.MedicalCourseService;
import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.app.doctor.medical_Council.service.MedicalCouncilService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/public/medical/course")
public class MedicalMedicalCourseControllerPublic {

    @Autowired
    private MedicalCourseService medicalCourseService;

    @GetMapping(value = "/list/{name}")
    public List<MedicalCourseDto> getMedicalCouncilsByName(@PathVariable String name) {
        return medicalCourseService.getAllMedicalCourseName(name);
    }

    @GetMapping(value = "/list")
    public List<MedicalCourseDto> getAllMedicalCourse() {
        return medicalCourseService.getAllMedicalCourse();
    }

}
