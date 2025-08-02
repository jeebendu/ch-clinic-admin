package com.jee.clinichub.app.doctor.scheduleBreak.service;


import java.util.List;

import com.jee.clinichub.app.doctor.scheduleBreak.model.ScheduleBreakDTO;
import com.jee.clinichub.global.model.Status;


public interface ScheduleBreakService {

    Status saveOrUpdate(List<ScheduleBreakDTO> scheduleBreakList,Long drBranchId);

    Status deleteById(Long id);

    ScheduleBreakDTO getById(Long id);

    List<ScheduleBreakDTO> findAll();

    List<ScheduleBreakDTO> findAllByBranchId(Long branchId);

     List<ScheduleBreakDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId);

     List<ScheduleBreakDTO> findByDoctorBranchid(Long drBranchId);
    
}
