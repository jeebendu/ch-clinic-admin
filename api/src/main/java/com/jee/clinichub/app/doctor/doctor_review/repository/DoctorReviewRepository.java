package com.jee.clinichub.app.doctor.doctor_review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.doctor_review.model.DoctorReview;
import com.jee.clinichub.app.doctor.doctor_review.model.DoctorReviewDto;



@Repository
public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Long> {

    List<DoctorReview> findAllByDoctor_id(Long id);
    
    
}
