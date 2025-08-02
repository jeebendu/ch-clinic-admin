package com.jee.clinichub.app.doctor.doctorServiceMap.service;

import java.util.List;

import com.jee.clinichub.app.doctor.doctorServiceMap.model.DoctorServiceMapDto;
import com.jee.clinichub.global.model.Status;


public interface DoctorServiceMapService {

	List<DoctorServiceMapDto> getAllDoctorServiceMap();

   
      Status saveOrUpdate(DoctorServiceMapDto doctorServiceMap);

      Status deleteById(Long id);

      DoctorServiceMapDto getById(Long id);

      List<DoctorServiceMapDto> getByDoctorBranchId(Long id);


      List<DoctorServiceMapDto> getAllByBranchAndDoctor(Long doctorId, Long branchId);


      List<DoctorServiceMapDto> getListByDoctorId(Long id);

  

    
}
