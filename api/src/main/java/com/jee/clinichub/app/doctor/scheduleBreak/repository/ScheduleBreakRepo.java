package com.jee.clinichub.app.doctor.scheduleBreak.repository;


import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.scheduleBreak.model.ScheduleBreak;
import com.jee.clinichub.app.doctor.scheduleBreak.model.ScheduleBreakDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek;

@Repository
public interface ScheduleBreakRepo  extends JpaRepository<ScheduleBreak,Long>{

    List<ScheduleBreak> findAllByDoctorBranch_branch_id(Long branchId);

  List<ScheduleBreak> findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_idOrderByIdAsc(Long branchId, Long doctorId);

    List<ScheduleBreak> findAllByDoctorBranch_idAndDayOfWeek(Long id,DayOfWeek dayOfWeek);

    List<ScheduleBreak> findAllByDoctorBranch_id(Long drBranchId);

 
}
