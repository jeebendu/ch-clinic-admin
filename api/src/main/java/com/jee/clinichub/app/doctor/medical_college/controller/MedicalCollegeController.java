package com.jee.clinichub.app.doctor.medical_college.controller;
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
import com.jee.clinichub.app.doctor.medical_college.model.MedicalCollegeDto;
import com.jee.clinichub.app.doctor.medical_college.service.MedicalCollegeService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/medical/college")


public class MedicalCollegeController {
 @Autowired
    private MedicalCollegeService medicalCollegeService;


    @GetMapping(value="/list")
    public List<MedicalCollegeDto> getAllMedicalCollege(){
        return medicalCollegeService.getAllMedicalCollege();
    }
    

    
    @PostMapping(value="/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody   MedicalCollegeDto medicalCollegeDto){
        return medicalCollegeService.saveOrUpdate(medicalCollegeDto);
    }

    @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id){
        return medicalCollegeService.deleteById(id);
    }
    
}