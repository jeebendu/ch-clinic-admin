package com.jee.clinichub.app.core.state.controller;

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

import com.jee.clinichub.app.core.state.model.StateDto;
import com.jee.clinichub.app.core.state.service.StateService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("v1/state")
public class StateController {

    
    @Autowired
    private StateService stateService;

    @GetMapping(value="/list")
    public List<StateDto> findAll(){
        return stateService.findAll();
    }
    
    @GetMapping(value="/id/{id}")
    public  StateDto getById(@PathVariable Long id ){
        return stateService.getById(id);
    }

    @GetMapping(value="/listByCountryId/{cid}")
    public List<StateDto> getByCountryId(@PathVariable Long cid ){
        return stateService.getByCountryId(cid);
    }

 


    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveState(@RequestBody @Valid StateDto stateDto,HttpServletRequest request,Errors errors){
        return stateService.saveOrUpdate(stateDto);
    }

     @GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return stateService.deleteById(id);
    }

    
}
