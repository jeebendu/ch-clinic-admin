package com.jee.clinichub.app.admin.clinic.clinicReview.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.clinic.clinicReview.model.ClinicReview;
import com.jee.clinichub.app.admin.clinic.clinicReview.model.ClinicReviewDto;
import com.jee.clinichub.app.admin.clinic.clinicReview.service.ClinicReviewService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/v1/api/clinic-review")
public class ClinicReviewControllor {

    @Autowired
    private ClinicReviewService cReviewService;

    @GetMapping(value = "/list")
    public List<ClinicReviewDto> getAllReview() {
        return cReviewService.getAllReview();
    }

    @GetMapping(value = "/id/{id}")
    public ClinicReviewDto getById(@PathVariable Long id) {
        return cReviewService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status savePatient(@RequestBody ClinicReviewDto review) {
        return cReviewService.saveOrUpdate(review);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return cReviewService.deleteById(id);
    }

    @GetMapping(path = "/clinic/id/{id}")
    public List<ClinicReviewDto> getAllByClinicId(@PathVariable Long id) {
        return cReviewService.getAllByClinicId(id);
    }

    @GetMapping(path = "/branch/id/{id}")
    public List<ClinicReview> getAllByBranchId(@PathVariable Long id) {
        return cReviewService.getAllByBranchId(id);
    }

    
}
