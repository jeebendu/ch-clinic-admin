package com.jee.clinichub.app.doctor.availability.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.availability.entity.DoctorAvailability;
import com.jee.clinichub.app.doctor.availability.entity.DoctorAvailabilityDTO;
import com.jee.clinichub.app.doctor.availability.service.DoctorAvailabilityService;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/available")
public class DoctorAvailabilityController {
    
  @Autowired
    private DoctorAvailabilityService availabilityService;
    
    @GetMapping(value="/list")
    public List<DoctorAvailabilityDTO> getAllAvailabilityList(){
        return availabilityService.getAllAvailability();
    }

    @GetMapping(value="/id/{id}")
    public DoctorAvailability getById(@PathVariable Long id){
        return availabilityService.getAvailabilityById(id);
    }

    @DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id){
        return availabilityService.deleteById(id);
    }

    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveOrUpdate(@RequestBody @Valid DoctorAvailabilityDTO availabilityDTO){
        return availabilityService.saveOrUpdate(availabilityDTO);
    }

}
