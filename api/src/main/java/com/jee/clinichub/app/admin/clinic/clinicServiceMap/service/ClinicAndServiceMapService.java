package com.jee.clinichub.app.admin.clinic.clinicServiceMap.service;

import java.util.List;

import com.jee.clinichub.app.admin.clinic.clinicServiceMap.model.ClinicAndServiceMapDto;
import com.jee.clinichub.global.model.Status;

public interface ClinicAndServiceMapService {
     List<ClinicAndServiceMapDto> getAllService();

     ClinicAndServiceMapDto getById(Long id);

    Status saveOrUpdate(ClinicAndServiceMapDto patient);

    Status deleteById(Long id);

  
    List<ClinicAndServiceMapDto> getAllByBranchId(Long id);

}
