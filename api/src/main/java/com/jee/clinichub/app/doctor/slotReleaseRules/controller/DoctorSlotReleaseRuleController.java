
package com.jee.clinichub.app.doctor.slotReleaseRules.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.slotReleaseRules.model.DoctorSlotReleaseRuleDTO;
import com.jee.clinichub.app.doctor.slotReleaseRules.service.DoctorSlotReleaseRuleService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/doctor/slot-release-rules")
@RequiredArgsConstructor
public class DoctorSlotReleaseRuleController {

    private final DoctorSlotReleaseRuleService ruleService;

    @PostMapping("/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody DoctorSlotReleaseRuleDTO ruleDTO) {
        return ruleService.saveOrUpdate(ruleDTO);
    }

    @PostMapping("/batch/doctor-branch/{doctorBranchId}")
    public Status saveOrUpdateBatch(@RequestBody List<DoctorSlotReleaseRuleDTO> ruleDTOs, 
                                  @PathVariable Long doctorBranchId) {
        return ruleService.saveOrUpdateBatch(ruleDTOs, doctorBranchId);
    }

    @DeleteMapping("/delete/{id}")
    public Status deleteById(@PathVariable Long id) {
        return ruleService.deleteById(id);
    }

    @GetMapping("/id/{id}")
    public DoctorSlotReleaseRuleDTO getById(@PathVariable Long id) {
        return ruleService.getById(id);
    }

    @GetMapping("/doctor-branch/{doctorBranchId}")
    public List<DoctorSlotReleaseRuleDTO> getByDoctorBranchId(@PathVariable Long doctorBranchId) {
        return ruleService.getByDoctorBranchId(doctorBranchId);
    }

    @PostMapping("/create-default/doctor-branch/{doctorBranchId}")
    public Status createDefaultRule(@PathVariable Long doctorBranchId) {
        return ruleService.createDefaultRule(doctorBranchId);
    }
}
