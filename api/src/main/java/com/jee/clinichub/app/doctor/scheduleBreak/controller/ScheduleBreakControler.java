package com.jee.clinichub.app.doctor.scheduleBreak.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.doctor.scheduleBreak.model.ScheduleBreakDTO;
import com.jee.clinichub.app.doctor.scheduleBreak.service.ScheduleBreakService;
import com.jee.clinichub.global.model.Status;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/doctor/schedule-break")
@RequiredArgsConstructor
public class ScheduleBreakControler {

    private final ScheduleBreakService sBreakService;

    @PostMapping(value = "/saveOrUpdate/doctor-branch/{drBranchId}")
    public Status saveOrUpdate(@RequestBody List<ScheduleBreakDTO> scheduleBreakList, @PathVariable Long drBranchId) {
        return sBreakService.saveOrUpdate(scheduleBreakList, drBranchId);
    }

    @DeleteMapping("/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return sBreakService.deleteById(id);
    }

    @GetMapping("/id/{id}")
    public ScheduleBreakDTO getById(@PathVariable Long id) {
        return sBreakService.getById(id);
    }

    @GetMapping("/list")
    public List<ScheduleBreakDTO> findAll() {
        return sBreakService.findAll();
    }

    @GetMapping("/branch/{branchId}")
    public List<ScheduleBreakDTO> findAllByBranchId(@PathVariable Long branchId) {
        return sBreakService.findAllByBranchId(branchId);
    }

    @GetMapping("/branch/{branchId}/doctor/{doctorId}")
    public List<ScheduleBreakDTO> findAllByBranchAndDoctorId(@PathVariable Long branchId, @PathVariable Long doctorId) {
        return sBreakService.findAllByBranchAndDoctorId(branchId, doctorId);
    }

    @GetMapping("/doctor-branch/{drBranchId}")
    public List<ScheduleBreakDTO> findByDoctorBranchid(@PathVariable Long drBranchId) {
        return sBreakService.findByDoctorBranchid(drBranchId);
    }
}
