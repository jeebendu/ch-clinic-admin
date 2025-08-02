
package com.jee.clinichub.app.core.district.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.district.model.DistrictDto;
import com.jee.clinichub.app.core.district.service.DistrictService;
import com.jee.clinichub.global.model.Status;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/district")
public class DistrictController {

    @Autowired
    private DistrictService districtService;

    @GetMapping(value="/list")
    public List<DistrictDto> findAll(){
        return districtService.findAll();
    }
    
    @GetMapping(value="/id/{id}")
    public DistrictDto getById(@PathVariable Long id ){
        return districtService.getById(id);
    }

    @GetMapping(value="/state/id/{id}")
    public List<DistrictDto> getByState_id(@PathVariable Integer id ){
        return districtService.getByState_id(id);
    }


    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveCity(@RequestBody @Valid DistrictDto districtDto,HttpServletRequest request,Errors errors){
        return districtService.saveOrUpdate(districtDto);
    }

    @GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return districtService.deleteById(id);
    }

        @GetMapping(value="/list/{name}")
    public List<DistrictDto> filterByName(@PathVariable String name){
        return districtService.filterByName(name);
    }

}
