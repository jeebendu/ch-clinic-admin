package com.jee.clinichub.app.doctor.medical_college.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jee.clinichub.app.doctor.medical_college.model.MedicalCollegeDto;
import com.jee.clinichub.app.doctor.medical_college.service.MedicalCollegeService;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/public/medical/college")

public class MedicalCollegePublicController {
 
    @Autowired
    private MedicalCollegeService medicalCollegeService;

    @GetMapping(value = "/list/{name}")
    public List<MedicalCollegeDto> getMedicalCollegeByName(@PathVariable String name) {
        return medicalCollegeService.getMedicalCollegeByName(name);
    }

}
