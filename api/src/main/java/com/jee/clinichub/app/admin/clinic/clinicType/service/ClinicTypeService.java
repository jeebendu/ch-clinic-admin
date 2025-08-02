package com.jee.clinichub.app.admin.clinic.clinicType.service;

import java.util.List;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeDto;
import com.jee.clinichub.global.model.Status;

public interface ClinicTypeService {

    List<ClinicTypeDto> getAllClinicType();

    ClinicTypeDto getById(Long id);

    Status saveOrUpdate(ClinicTypeDto clinicTypeDto);

    Status deleteById(Long id);

    List<ClinicTypeDto> filterType(ClinicTypeDto search);

}
