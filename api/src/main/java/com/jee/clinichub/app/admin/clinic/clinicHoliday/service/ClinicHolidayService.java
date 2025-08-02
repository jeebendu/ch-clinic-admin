package com.jee.clinichub.app.admin.clinic.clinicHoliday.service;


import java.util.List;

import com.jee.clinichub.app.admin.clinic.clinicHoliday.model.ClinicHolidayDto;
import com.jee.clinichub.global.model.Status;




public interface ClinicHolidayService {

     List<ClinicHolidayDto> getAllHoliday();

    ClinicHolidayDto getById(Long id);

    Status saveOrUpdate(ClinicHolidayDto branch);

    Status deleteById(Long id);

    List<ClinicHolidayDto> getByBranchId(Long id);

    
}
