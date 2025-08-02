package com.jee.clinichub.app.admin.clinic.clinicReview.model;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.patient.model.PatientDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClinicReviewDto {

    private Long id;
    private String massage;

    private double rating;
    private BranchDto branch;
    private PatientDto patient;
    private ClinicDto clinic;

    public ClinicReviewDto(ClinicReview clinicReviewDto) {
        this.id = clinicReviewDto.getId();
        this.massage = clinicReviewDto.getMassage();
        this.rating = clinicReviewDto.getRating();
        this.clinic = new ClinicDto(clinicReviewDto.getClinic());
        this.patient = new PatientDto(clinicReviewDto.getPatient());
        this.branch = new BranchDto(clinicReviewDto.getBranch());
    }

}
