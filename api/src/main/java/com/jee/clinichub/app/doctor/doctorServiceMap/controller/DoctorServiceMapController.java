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
@RequestMapping("v1/doctor-service-map")
public class DoctorServiceMapController {

    private final DoctorServiceMapService doctorServiceMapService;

    @GetMapping(value = "/list")
    public List<DoctorServiceMapDto> getAllDoctorServiceMaps() {
        return doctorServiceMapService.getAllDoctorServiceMap();
    }

    @GetMapping("/doctor/{doctorId}/branch/{branchId}")
    public List<DoctorServiceMapDto> getAllByBranchAndDoctor(@PathVariable Long doctorId,@PathVariable Long branchId) {
        return doctorServiceMapService.getAllByBranchAndDoctor(doctorId ,branchId );
    }

    @GetMapping("/doctor-branch/id/{id}")
    public List<DoctorServiceMapDto> getByDoctorBranchId(@PathVariable Long id) {
        return doctorServiceMapService.getByDoctorBranchId(id);
    }

    @GetMapping(value = "/id/{id}")
    public DoctorServiceMapDto getById(@PathVariable Long id) {
        return doctorServiceMapService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveDoctor(@RequestBody @Valid DoctorServiceMapDto doctorServiceMap, Errors errors) {
        return doctorServiceMapService.saveOrUpdate(doctorServiceMap);
    }

    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return doctorServiceMapService.deleteById(id);
    }

}

