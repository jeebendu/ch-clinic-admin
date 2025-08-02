package com.jee.clinichub.app.appointment.appointmentType.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;
import com.jee.clinichub.app.appointment.appointmentType.service.AppointmentTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/public/appointment-type")
public class PublicAppointmentTypeController {
     private final  AppointmentTypeService appointmentTypeService;

        @GetMapping(value="/list")
    public List<AppointmentType> getAllType(){
        return appointmentTypeService.getAllType();
    }
}
