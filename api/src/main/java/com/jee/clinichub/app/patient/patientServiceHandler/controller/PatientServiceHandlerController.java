package com.jee.clinichub.app.patient.patientServiceHandler.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.percentage.model.PercentageDTO;
import com.jee.clinichub.app.patient.patientServiceHandler.model.PatientServiceHandlerDTO;
import com.jee.clinichub.app.patient.patientServiceHandler.service.PatientServiceHandlerService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/service/handler")
public class PatientServiceHandlerController {


    @Autowired
    private PatientServiceHandlerService patientServiceHandlerService;
    
    @GetMapping(value="/list")
    public List<PatientServiceHandlerDTO> getAllServiceHandler(){
        return patientServiceHandlerService.getAllServiceHandler();
    }
    
    
    @GetMapping(value="/id/{id}")
    public PatientServiceHandlerDTO getById(@PathVariable Long id ){
        return patientServiceHandlerService.getById(id);
    }
    
    
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveEnquiry(@RequestBody @Valid PatientServiceHandlerDTO service,HttpServletRequest request,Errors errors){
        return patientServiceHandlerService.saveOrUpdate(service);
    }
    
   
	@DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return patientServiceHandlerService.deleteById(id);
    }
    
    	@GetMapping(value="/patient/id/{id}")
	    public List<PatientServiceHandlerDTO> getPercentageByDoctorId(@PathVariable Long id ){
	        return patientServiceHandlerService.getServicegeByPatientId(id);
	    }
}
