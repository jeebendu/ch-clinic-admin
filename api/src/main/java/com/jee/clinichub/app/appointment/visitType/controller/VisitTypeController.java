package com.jee.clinichub.app.appointment.visitType.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.visitType.model.VisitType;
import com.jee.clinichub.app.appointment.visitType.service.VisitTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/visit-type")
public class VisitTypeController {
    
     @Autowired
    private VisitTypeService visitTypeService;

    // @Cacheable(value = "visitCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<VisitType> getAllVisitType(){
        return visitTypeService.getAllVisitType();
    }
    
    
    
}
