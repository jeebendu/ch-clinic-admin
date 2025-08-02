package com.jee.clinichub.app.doctor.doctor_review.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.doctor.doctor_review.model.DoctorReviewDto;
import com.jee.clinichub.global.model.Status;

public interface DoctorReviewService {

    Page<DoctorReviewDto> getAll(Pageable pageable);

    DoctorReviewDto getById(Long id);

    List<DoctorReviewDto> getByDoctorId(Long id);

    Status saveOrUpdate(DoctorReviewDto doctorReviewDto);
    
}
