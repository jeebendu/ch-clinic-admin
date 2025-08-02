package com.jee.clinichub.app.doctor.medicalCourse.controller;



import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourseDto;
import com.jee.clinichub.app.doctor.medicalCourse.service.MedicalCourseService;
import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.app.doctor.medical_Council.service.MedicalCouncilService;
import com.jee.clinichub.global.model.Status;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/medical/course")
public class MedicalCourseController {

    @Autowired
    private MedicalCourseService medicalCourseService;


    @GetMapping(value="/list")
    public List<MedicalCourseDto> getAllMedicalCourse(){
        return medicalCourseService.getAllMedicalCourse();
    }
    

    
    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody   MedicalCourseDto medicalCourseDto){
        return medicalCourseService.saveOrUpdate(medicalCourseDto);
    }

    @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id){
        return medicalCourseService.deleteById(id);
    }
    
}
