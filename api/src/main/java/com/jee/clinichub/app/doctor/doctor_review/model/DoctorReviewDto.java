package com.jee.clinichub.app.doctor.doctor_review.model;

import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.model.Patient;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DoctorReviewDto {


  
    private Long id;

    
    private Doctor doctor;

   
    private Patient patient;

    private int likes;

    private int dislike;

    private String message;

    private Double rating;

    private boolean isrecommended;


    public DoctorReviewDto(DoctorReview doctorReview) {
        this.id = doctorReview.getId();
        this.doctor = doctorReview.getDoctor();
        this.patient = doctorReview.getPatient();
        this.likes = doctorReview.getLikes();
        this.dislike = doctorReview.getDislike();
        this.message = doctorReview.getMessage();
        this.rating = doctorReview.getRating();
        this.isrecommended = doctorReview.isIsrecommended();
    }



    
}
