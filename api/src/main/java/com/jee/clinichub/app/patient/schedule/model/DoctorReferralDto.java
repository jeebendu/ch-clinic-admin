package com.jee.clinichub.app.patient.schedule.model;

import com.jee.clinichub.app.doctor.model.Doctor;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorReferralDto  {

    private Doctor doctor;
    private List<ReferralCount> referralCounts;
    

}