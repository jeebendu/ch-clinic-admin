package com.jee.clinichub.app.doctor.weeklySchedule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;

@Repository
public interface WeeklyScheduleRepo extends JpaRepository<WeeklySchedule, Long> {

    List<WeeklySchedule> findAllByDoctorBranch_branch_id(Long branchId);

    List<WeeklySchedule> findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_idOrderByIdAsc(Long branchId,
            Long doctorId);

    List<WeeklySchedule> findAllByActive(boolean b);

    List<WeeklySchedule> findAllByDoctorBranch_doctor_idAndActive(Long doctorId, boolean b);

    boolean existsByDoctorBranch_idAndDayOfWeekAndIdNot(Long id, DayOfWeek dayOfWeek, long l);

    List<WeeklySchedule> findAllByDoctorBranch_idOrderByIdAsc(Long drBranchId);

	List<WeeklySchedule> findAllByDoctorBranch_idAndActive(Long doctorBranchId, boolean b);

}
