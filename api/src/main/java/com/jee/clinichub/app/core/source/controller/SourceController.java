package com.jee.clinichub.app.core.source.controller;


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

import com.jee.clinichub.app.core.source.model.SourceDTO;
import com.jee.clinichub.app.core.source.service.SourceService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/source")
public class SourceController {
    
      @Autowired
    private SourceService sourceService;


    @GetMapping(value="/list")
    public List<SourceDTO> getAllBranches(){
        return sourceService.getAllBranches();
    }
    
   
    @GetMapping(value="/id/{id}")
    public SourceDTO getById(@PathVariable Long id ){
        return sourceService.getById(id);
    }
    

    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveBranch(@RequestBody @Valid SourceDTO sourceDTO,HttpServletRequest request,Errors errors){
        return sourceService.saveOrUpdate(sourceDTO);
    }
    
	@DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return sourceService.deleteById(id);
    }   


}
