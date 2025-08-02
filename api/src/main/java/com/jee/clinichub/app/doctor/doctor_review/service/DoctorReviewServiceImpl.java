package com.jee.clinichub.app.doctor.doctor_review.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.doctor_review.model.DoctorReview;
import com.jee.clinichub.app.doctor.doctor_review.model.DoctorReviewDto;
import com.jee.clinichub.app.doctor.doctor_review.repository.DoctorReviewRepository;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorReviewServiceImpl implements DoctorReviewService {

    private final DoctorReviewRepository doctorReviewRepository;

    @Override
    public Page<DoctorReviewDto> getAll(Pageable pageable) {

        return doctorReviewRepository.findAll(pageable).map(DoctorReviewDto::new);

    }

    @Override
    public DoctorReviewDto getById(Long id) {
        return doctorReviewRepository.findById(id).map(DoctorReviewDto::new).orElse(null);
    }

    @Override
    public List<DoctorReviewDto> getByDoctorId(Long id) {
        return doctorReviewRepository.findAllByDoctor_id(id).stream().map(DoctorReviewDto::new).toList();
    }

    @Override
    public Status saveOrUpdate(DoctorReviewDto doctorReviewDto) {
        try {
            DoctorReview entity = new DoctorReview(doctorReviewDto);
            DoctorReview saved = doctorReviewRepository.save(entity);
            return new Status(true, "save successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }
}
