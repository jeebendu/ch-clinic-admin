
package com.jee.clinichub.app.doctor.weeklySchedule.service;

import java.util.List;

import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleWithoutDrBranch;
import com.jee.clinichub.global.model.Status;


public interface WeeklyScheduleService {

    Status saveOrUpdate(List<WeeklyScheduleDTO> scheduleDtoList,Long drBranchId);

    Status deleteById(Long id);

    WeeklyScheduleDTO getById(Long id);

    List<WeeklyScheduleDTO> findAll();

    List<WeeklyScheduleDTO> findAllByBranchId(Long branchId);

    List<WeeklyScheduleDTO> findAllByDoctorId(Long doctorId);

    List<WeeklyScheduleDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId);
    
    List<WeeklySchedule> findAllByActive(boolean b);

    List<WeeklyScheduleWithoutDrBranch> findAllByDoctorBranchId(Long drBranchId);

    Status generatePreviewSlots(Long doctorBranchId);
}
