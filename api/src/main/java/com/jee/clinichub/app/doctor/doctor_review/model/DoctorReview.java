package com.jee.clinichub.app.doctor.doctor_review.model;

import java.io.Serializable;

import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "doctor_review")
public class DoctorReview extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(name = "likes")
    private int likes;

    @Column(name = "dislike")
    private int dislike;

    @Column(name = "message")
    private String message;

   
    private Double rating;

    @Column(name = "isrecommended")
    private boolean isrecommended;

    public DoctorReview(DoctorReviewDto doctorReviewDTO) {
        if (doctorReviewDTO.getId() != null) {
            this.id = doctorReviewDTO.getId();
        }
        this.doctor = doctorReviewDTO.getDoctor();
        this.patient = doctorReviewDTO.getPatient();
        this.likes = doctorReviewDTO.getLikes();
        this.dislike = doctorReviewDTO.getDislike();
        this.message = doctorReviewDTO.getMessage();
        this.rating = doctorReviewDTO.getRating();
        this.isrecommended = doctorReviewDTO.isIsrecommended();
    }

}
