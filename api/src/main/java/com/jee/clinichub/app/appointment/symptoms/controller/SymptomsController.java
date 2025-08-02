package com.jee.clinichub.app.appointment.symptoms.controller;



import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.symptoms.model.Symptoms;
import com.jee.clinichub.app.appointment.symptoms.model.SymptomsDto;
import com.jee.clinichub.app.appointment.symptoms.service.SymptomsService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/symptoms")
@RequiredArgsConstructor
public class SymptomsController {

    
    private final  SymptomsService symptomsService;

    
    @GetMapping(value="/list")
    public List<SymptomsDto> getAll(){
        return symptomsService.getAll();
    }
    
   
    @GetMapping(value="/id/{id}")
    public SymptomsDto getById(@PathVariable Long id ){
        return symptomsService.getById(id);
    }
    
   
    @PostMapping(value="/saveOrUpdate")
    public Status saveCategory(@RequestBody @Valid SymptomsDto symptomsDto,HttpServletRequest request,Errors errors){
        return symptomsService.saveOrUpdate(symptomsDto);
    }
    
   
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return symptomsService.deleteById(id);
    }

    @PostMapping(value="/filter")
    public List<Symptoms> filterSymptoms(@RequestBody SymptomsDto filter ){
        return symptomsService.filterSymptoms(filter);
    }

}
