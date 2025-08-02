package com.jee.clinichub.app.doctor.doctorServiceMap.controller;

import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.doctorServiceMap.model.DoctorServiceMapDto;
import com.jee.clinichub.app.doctor.doctorServiceMap.service.DoctorServiceMapService;
import com.jee.clinichub.global.model.Status;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/public/doctor-service-map")
public class DoctorServiceMapPublicController {

    private final DoctorServiceMapService doctorServiceMapService;



    @GetMapping("/doctor/{doctorId}/branch/{branchId}")
    public List<DoctorServiceMapDto> getAllByBranchAndDoctor(@PathVariable Long doctorId,@PathVariable Long branchId) {
        return doctorServiceMapService.getAllByBranchAndDoctor(doctorId ,branchId );
    }

    @GetMapping("/doctor-branch/id/{id}")
    public List<DoctorServiceMapDto> getByDoctorBranchId(@PathVariable Long id) {
        return doctorServiceMapService.getByDoctorBranchId(id);
    }

    @GetMapping(value = "/doctor/id/{id}")
    public  List<DoctorServiceMapDto> getListByDoctorId(@PathVariable Long id) {
        return doctorServiceMapService.getListByDoctorId(id);
    }
}

