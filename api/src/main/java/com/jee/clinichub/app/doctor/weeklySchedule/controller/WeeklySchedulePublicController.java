package com.jee.clinichub.app.doctor.weeklySchedule.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.service.WeeklyScheduleService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins  = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/public/doctor/weekly-schedule")
@RequiredArgsConstructor
public class WeeklySchedulePublicController {
    
    private final WeeklyScheduleService wScheduleService;

   

    @GetMapping("/id/{id}")
    public WeeklyScheduleDTO getById(@PathVariable Long id) {
        return wScheduleService.getById(id);
    }

    @GetMapping("/branch/{branchId}/doctor/{doctorId}")
    public List<WeeklyScheduleDTO> findAllByBranchAndDoctorId(@PathVariable Long branchId, @PathVariable Long doctorId) {
        return wScheduleService.findAllByBranchAndDoctorId(branchId, doctorId);
    }

        @GetMapping("/doctor/{doctorId}")
    public List<WeeklyScheduleDTO> findAllByDoctorId(@PathVariable Long doctorId) {
        return wScheduleService.findAllByDoctorId(doctorId);
    }

}
