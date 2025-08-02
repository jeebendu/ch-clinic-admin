package com.jee.clinichub.app.appointment.appointmentType.controller;





import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;
import com.jee.clinichub.app.appointment.appointmentType.service.AppointmentTypeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/appointment-type")
public class AppointmentTypeController {
    
     @Autowired
    private AppointmentTypeService appointmentTypeService;

    // @Cacheable(value = "typeCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<AppointmentType> getAllType(){
        return appointmentTypeService.getAllType();
    }
    
    
    
}
