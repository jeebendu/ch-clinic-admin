package com.jee.clinichub.app.core.status.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.status.model.StatusDTO;
import com.jee.clinichub.app.core.status.service.StatusService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/status")
public class StatusController {
    
    
      @Autowired
    private StatusService statusService;


    @GetMapping(value="/list")
    public List<StatusDTO> getAllBranches(){
        return statusService.getAllBranches();
    }
    
   
    @GetMapping(value="/id/{id}")
    public StatusDTO getById(@PathVariable Long id ){
        return statusService.getById(id);
    }
    

    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveBranch(@RequestBody @Valid StatusDTO statusDTO,HttpServletRequest request,Errors errors){
        return statusService.saveOrUpdate(statusDTO);
    }
    
	@DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return statusService.deleteById(id);
    }   

}
