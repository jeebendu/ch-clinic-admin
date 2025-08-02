package com.jee.clinichub.app.admin.clinic.clinicFacility.service;

import java.util.List;

import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacilityDto;
import com.jee.clinichub.global.model.Status;

public interface ClinicFacilityService {

    List<ClinicFacilityDto> getAllFacility();

    ClinicFacilityDto getById(Long id);

    Status saveOrUpdate(ClinicFacilityDto facilityDto);

    Status deleteById(Long id);



    
}
