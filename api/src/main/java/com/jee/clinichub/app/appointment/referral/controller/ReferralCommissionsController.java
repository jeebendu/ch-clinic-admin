package com.jee.clinichub.app.appointment.referral.controller;

import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.appointment.referral.model.ReferralCommissionsDto;
import com.jee.clinichub.app.appointment.referral.service.ReferralCommissionsService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/referral-commission")
@RequiredArgsConstructor
public class ReferralCommissionsController {

   
    private final ReferralCommissionsService commissionsService;

    @PostMapping(value = "/saveOrUpdate")
    public ReferralCommissionsDto saveOrUpdate(@RequestBody ReferralCommissionsDto referralCommissionsDto) {
        return commissionsService.saveOrUpdate(referralCommissionsDto);
    }

    @GetMapping(value = "/id/{id}")
    public ReferralCommissionsDto getById(@PathVariable Long id) {
        return commissionsService.getById(id);
    }

    @GetMapping(value = "/list")
    public List<ReferralCommissionsDto> findAll() {
        return commissionsService.findAll();
    }

    @GetMapping(value = "/visit/id/{visitId}")
    public List<ReferralCommissionsDto> findAllByVisitId(@PathVariable Long visitId) {
        return commissionsService.findAllByVisitId(visitId);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return commissionsService.deleteById(id);
    }
}