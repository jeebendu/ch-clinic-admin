package com.jee.clinichub.app.doctor.weeklySchedule.controller;

import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleWithoutDrBranch;
import com.jee.clinichub.app.doctor.weeklySchedule.service.WeeklyScheduleService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/doctor/weekly-schedule")
@RequiredArgsConstructor
public class WeeklyScheduleController {

    private final WeeklyScheduleService wScheduleService;

    @PostMapping(value = "/saveOrUpdate/doctor-branch/{drBranchId}")
    public Status saveOrUpdate(@RequestBody List<WeeklyScheduleDTO> scheduleDtoList,@PathVariable Long drBranchId, HttpServletRequest request,
            Errors errors) {
        return wScheduleService.saveOrUpdate(scheduleDtoList,drBranchId);
    }

    @DeleteMapping("/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return wScheduleService.deleteById(id);
    }

    @GetMapping("/id/{id}")
    public WeeklyScheduleDTO getById(@PathVariable Long id) {
        return wScheduleService.getById(id);
    }

    @GetMapping("/list")
    public List<WeeklyScheduleDTO> findAll() {
        return wScheduleService.findAll();
    }

    @GetMapping("/branch/{branchId}")
    public List<WeeklyScheduleDTO> findAllByBranchId(@PathVariable Long branchId) {
        return wScheduleService.findAllByBranchId(branchId);
    }

    @GetMapping("/branch/{branchId}/doctor/{doctorId}")
    public List<WeeklyScheduleDTO> findAllByBranchAndDoctorId(@PathVariable Long branchId,
            @PathVariable Long doctorId) {
        return wScheduleService.findAllByBranchAndDoctorId(branchId, doctorId);
    }

    @GetMapping("/doctor-branch/{drBranchId}")
    public List<WeeklyScheduleWithoutDrBranch> findAllByDoctorBranchId(@PathVariable Long drBranchId) {
        return wScheduleService.findAllByDoctorBranchId(drBranchId);
    }

    @PostMapping("/generate-preview-slots/{doctorBranchId}")
    public Status generatePreviewSlots(@PathVariable Long doctorBranchId) {
        return wScheduleService.generatePreviewSlots(doctorBranchId);
    }

    @GetMapping("/slots/doctor-branch/{doctorBranchId}")
    public List<Slot> getSlotsByDoctorBranchId(
            @PathVariable Long doctorBranchId,
            @RequestParam(required = false) String date) {
        return wScheduleService.getSlotsByDoctorBranchId(doctorBranchId, date);
    }
}
