package com.jee.clinichub.app.doctor.doctorLeave.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.doctor.doctorLeave.model.DoctorLeaveDTO;
import com.jee.clinichub.app.doctor.doctorLeave.service.DoctorLeaveService;
import com.jee.clinichub.global.model.Status;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/doctor-leave")
@RequiredArgsConstructor
public class DoctorLeaveController {

    private final DoctorLeaveService drLeaveService;

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody DoctorLeaveDTO doctorLeaveDTO) {
        return drLeaveService.saveOrUpdate(doctorLeaveDTO);
    }

    @DeleteMapping("/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return drLeaveService.deleteById(id);
    }

    @GetMapping("/id/{id}")
    public DoctorLeaveDTO getById(@PathVariable Long id) {
        return drLeaveService.getById(id);
    }

    @GetMapping("/list")
    public List<DoctorLeaveDTO> findAll() {
        return drLeaveService.findAll();
    }

    @GetMapping("/branch/{branchId}")
    public List<DoctorLeaveDTO> findAllByBranchId(@PathVariable Long branchId) {
        return drLeaveService.findAllByBranchId(branchId);
    }

    @GetMapping("/branch/{branchId}/doctor/{doctorId}")
    public List<DoctorLeaveDTO> findAllByBranchAndDoctorId(@PathVariable Long branchId, @PathVariable Long doctorId) {
        return drLeaveService.findAllByBranchAndDoctorId(branchId, doctorId);
    }

    @GetMapping("/doctor-branch/{drBranchId}")
    public List<DoctorLeaveDTO> findAllByBranchDoctorId(@PathVariable Long drBranchId) {
        return drLeaveService.findAllByBranchDoctorId(drBranchId);
    }
}
