package com.jee.clinichub.app.appointment.referral.model;

import java.util.Date;

import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReferralCommissionsDto {
    
     
    private Long id;

    private ScheduleDto visit;
    
    private DoctorDto referralDoctor;

    private Double commissionAmount;

    private ReferralCommissionStatus status;

    private Date calculatedOn;

    public ReferralCommissionsDto(ReferralCommissions commissions) {
        if (commissions != null) {
            this.id = commissions.getId();
            this.visit = new ScheduleDto(commissions.getVisit());
            this.referralDoctor = new DoctorDto(commissions.getReferralDoctor());
            this.commissionAmount = commissions.getCommissionAmount();
            this.status = commissions.getStatus();
            this.calculatedOn = commissions.getCalculatedOn();
        }
    }
}
