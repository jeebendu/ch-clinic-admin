package com.jee.clinichub.app.doctor.doctor_review.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jee.clinichub.app.doctor.doctor_review.model.DoctorReviewDto;
import com.jee.clinichub.app.doctor.doctor_review.service.DoctorReviewService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/v1/doctor-review")
@RequiredArgsConstructor
public class DoctorReviewController {

    private final DoctorReviewService doctorReviewService;

    @GetMapping("/list")
    public Page<DoctorReviewDto> getAll(Pageable pageable) {
        return doctorReviewService.getAll(pageable);
    }

    @GetMapping("/id/{id}")
    public DoctorReviewDto getById(@PathVariable Long id) {
        return doctorReviewService.getById(id);
    }

    @GetMapping("/doctor/id/{id}")
    public List<DoctorReviewDto> getByDoctorId(@PathVariable Long id) {
        return doctorReviewService.getByDoctorId(id);
    }

    @PostMapping("/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody DoctorReviewDto doctorReviewDto) {
        return doctorReviewService.saveOrUpdate(doctorReviewDto);
    }

}
