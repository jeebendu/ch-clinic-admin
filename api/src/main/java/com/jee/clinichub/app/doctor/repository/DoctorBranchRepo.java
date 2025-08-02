package com.jee.clinichub.app.doctor.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchProj;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;

@Repository
public interface DoctorBranchRepo extends JpaRepository<DoctorBranch, Long> {

    Optional<DoctorBranch> findByDoctor_idAndBranch_id(Long id, Long id2);

    Optional<DoctorBranch> findByGlobalDoctorBranchId(UUID doctorBranchGlobalId);

    @Query("SELECT DISTINCT d FROM DoctorBranch d " +
            "LEFT JOIN d.doctor.specializationList s " +
            "WHERE (:branchId IS NULL OR d.branch.id = :branchId) " +
            "AND (:ids IS NULL OR s.id IN :ids) " +
            "ORDER BY d.id DESC")
    List<DoctorBranchProj> getAllDoctorBranch(List<Long> ids, Long branchId);


     @Query("SELECT DISTINCT d FROM DoctorBranch d " +
            "WHERE (:branchGlobalId IS NULL OR d.branch.globalBranchId = :branchGlobalId) " +
            "AND (:drGlobalId IS NULL OR d.doctor.globalDoctorId = :drGlobalId) " )
    Optional<DoctorBranch> findByDrAndBranchGlobalId(UUID drGlobalId, UUID branchGlobalId);

    // Additional query methods can be defined here if needed

}
