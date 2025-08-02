package com.jee.clinichub.app.appointment.labtest.controller;


import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.labtest.model.LabTest;
import com.jee.clinichub.app.appointment.labtest.model.LabTestDTO;
import com.jee.clinichub.app.appointment.labtest.service.LabTestService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/lab-test")
@RequiredArgsConstructor
public class LabTestsController {

    
    private final  LabTestService labTestService;

    
    @GetMapping(value="/list")
    public List<LabTestDTO> getAll(){
        return labTestService.getAll();
    }
    
   
    @GetMapping(value="/id/{id}")
    public LabTestDTO getById(@PathVariable Long id ){
        return labTestService.getById(id);
    }
    
   
    @PostMapping(value="/saveOrUpdate")
    public Status saveCategory(@RequestBody @Valid LabTestDTO labTestDTO,HttpServletRequest request,Errors errors){
        return labTestService.saveOrUpdate(labTestDTO);
    }
    
   
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return labTestService.deleteById(id);
    }

    @PostMapping(value="/filter")
    public List<LabTest> filterLabTests(@RequestBody LabTestDTO filter ){
        return labTestService.filterLabTests(filter);
    }

}
