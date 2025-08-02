package com.jee.clinichub.app.admin.clinic.clinicReview.service;

import java.util.List;

import com.jee.clinichub.app.admin.clinic.clinicReview.model.ClinicReview;
import com.jee.clinichub.app.admin.clinic.clinicReview.model.ClinicReviewDto;
import com.jee.clinichub.global.model.Status;

public interface ClinicReviewService {
      List<ClinicReviewDto> getAllReview();

    ClinicReviewDto getById(Long id);

    Status saveOrUpdate(ClinicReviewDto patient);

    Status deleteById(Long id);

    List<ClinicReviewDto> getAllByClinicId(Long id);

    List<ClinicReview> getAllByBranchId(Long id);

}
