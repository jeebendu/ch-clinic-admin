package com.jee.clinichub.app.doctor.percentage.service;

import java.util.List;

import com.jee.clinichub.app.doctor.percentage.model.PercentageDTO;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface PercentageService {


    public List<PercentageDTO> getAllPercentage();

    public PercentageDTO getById(Long id);

    public Status saveOrUpdate(@Valid PercentageDTO enquiryServiceTypeDto);

    public Status deleteById(Long id);

    public List<PercentageDTO> getPercentageByDoctorId(Long id);

    public List<PercentageDTO> findByIdAndEnquiryServiceTypeName(Long id, String name);
}
