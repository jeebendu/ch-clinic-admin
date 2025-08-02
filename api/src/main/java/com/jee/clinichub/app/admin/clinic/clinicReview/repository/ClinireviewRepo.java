package com.jee.clinichub.app.admin.clinic.clinicReview.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.jee.clinichub.app.admin.clinic.clinicReview.model.ClinicReview;

@Repository
public interface ClinireviewRepo extends JpaRepository<ClinicReview , Long> {

    List<ClinicReview > findAllByBranch_id(Long id);

    List<ClinicReview> findAllByClinic_id(Long id);

}
