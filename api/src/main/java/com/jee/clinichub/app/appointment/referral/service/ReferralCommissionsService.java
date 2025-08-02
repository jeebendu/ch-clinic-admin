package com.jee.clinichub.app.appointment.referral.service;

import java.util.List;

import com.jee.clinichub.app.appointment.referral.model.ReferralCommissionsDto;
import com.jee.clinichub.global.model.Status;

public interface ReferralCommissionsService {

    ReferralCommissionsDto saveOrUpdate(ReferralCommissionsDto referralCommissionsDto);

    ReferralCommissionsDto getById(Long id);

    List<ReferralCommissionsDto> findAll();

    List<ReferralCommissionsDto> findAllByVisitId(Long visitId);

    Status deleteById(Long id);
    
}
