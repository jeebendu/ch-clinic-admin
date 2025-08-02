package com.jee.clinichub.app.patient.schedule.model;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReferralCount  {

    private Date createdTime;
    private Long referralPatientCount;
}