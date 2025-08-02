package com.jee.clinichub.app.admin.clinic.clinicReview.model;

import java.io.Serializable;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="clinic_review")
public class ClinicReview  extends Auditable<String> implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String massage;

    private double rating;
    @OneToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @OneToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

	
	public ClinicReview(ClinicReviewDto clinicReviewDto) {
		this.id = clinicReviewDto.getId();
		this.massage=clinicReviewDto.getMassage();
        this.rating=clinicReviewDto.getRating();
        this.clinic=new Clinic (clinicReviewDto.getClinic());
	   this.patient=new Patient(clinicReviewDto.getPatient());
       this.branch=Branch.fromDto(clinicReviewDto.getBranch());
	}

}
