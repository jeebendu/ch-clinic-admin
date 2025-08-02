package com.jee.clinichub.app.doctor.doctorLeave.service;

import java.util.List;

import com.jee.clinichub.app.doctor.doctorLeave.model.DoctorLeaveDTO;
import com.jee.clinichub.global.model.Status;


public interface DoctorLeaveService {

    Status saveOrUpdate(DoctorLeaveDTO doctorLeaveDTO);

    Status deleteById(Long id);

    DoctorLeaveDTO getById(Long id);

    List<DoctorLeaveDTO> findAll();

    List<DoctorLeaveDTO> findAllByBranchId(Long branchId);

    List<DoctorLeaveDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId);

    List<DoctorLeaveDTO> findAllByBranchDoctorId(Long drBranchId);


}
