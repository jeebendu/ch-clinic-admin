package com.jee.clinichub.app.doctor.model;

import com.jee.clinichub.app.branch.model.Branch;

public interface DoctorBranchProj {
    
    Long getId();
    Branch getBranch();
    Double getConsultationFee();
    DoctorWithOutBranchProj getDoctor();
    String getGlobalDoctorBranchId();
}
