package com.jee.clinichub.app.doctor.doctorLeave.repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.doctorLeave.model.DoctorLeave;
import com.jee.clinichub.app.doctor.model.DoctorBranch;

@Repository
public interface DoctorLeaveRepo  extends JpaRepository<DoctorLeave,Long>{

    List<DoctorLeave> findAllByDoctorBranch_branch_id(Long branchId);

 List<DoctorLeave> findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_idOrderByIdAsc(Long branchId, Long doctorId);

    boolean existsByDoctorBranch_idAndLeaveStartLessThanEqualAndLeaveEndGreaterThanEqual(Long id,
            Date date, Date date2);

    List<DoctorLeave> findAllByDoctorBranch_id(Long drBranchId);

 
}
