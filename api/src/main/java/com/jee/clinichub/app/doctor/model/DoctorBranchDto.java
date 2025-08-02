package com.jee.clinichub.app.doctor.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jee.clinichub.app.branch.model.BranchDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DoctorBranchDto {

    private Long id;
    private BranchDto branch;
    private Double consultationFee;
    private UUID globalDoctorBranchId;

    public DoctorBranchDto(DoctorBranch doctorBranch) {
        this.id = doctorBranch.getId();
        this.branch = new BranchDto(doctorBranch.getBranch());
        this.consultationFee=doctorBranch.getConsultationFee();
        this.globalDoctorBranchId=doctorBranch.getGlobalDoctorBranchId();
    }

}
