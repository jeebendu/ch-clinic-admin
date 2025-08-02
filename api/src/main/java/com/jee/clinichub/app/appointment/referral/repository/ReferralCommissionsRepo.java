package com.jee.clinichub.app.appointment.referral.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.referral.model.ReferralCommissions;


@Repository
public interface ReferralCommissionsRepo extends JpaRepository<ReferralCommissions,Long>{

    Optional<ReferralCommissions> findAllByVisit_id(Long visitId);
    
}
