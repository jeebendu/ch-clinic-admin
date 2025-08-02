package com.jee.clinichub.app.admin.clinic.clinicFacility.controller;

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

import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacilityDto;
import com.jee.clinichub.app.admin.clinic.clinicFacility.service.ClinicFacilityService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping("/v1/api/clinic-facility")
public class ClinicFacilityController {
    
    
@Autowired
private ClinicFacilityService clinicFacilityService;
    

  
    @GetMapping(value="/list")
    public List<ClinicFacilityDto> getAllFacility(){
        return clinicFacilityService.getAllFacility();
    }
    
    
    @GetMapping(value="/id/{id}")
    public ClinicFacilityDto getById(@PathVariable Long id ){
        return clinicFacilityService.getById(id);
    }
    
    
    
    @PostMapping(value="/saveOrUpdate")
    public Status saveBranch(@RequestBody ClinicFacilityDto facilityDto){
        return clinicFacilityService.saveOrUpdate(facilityDto);
    }
    
   
   
	@DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return clinicFacilityService.deleteById(id);
    }
    
   
}
