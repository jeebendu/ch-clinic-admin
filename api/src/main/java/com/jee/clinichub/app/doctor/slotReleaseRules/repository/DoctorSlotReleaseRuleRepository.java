
package com.jee.clinichub.app.doctor.slotReleaseRules.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.slotReleaseRules.model.DoctorSlotReleaseRule;
import com.jee.clinichub.app.doctor.slotReleaseRules.model.ReleaseRuleScope;

@Repository
public interface DoctorSlotReleaseRuleRepository extends JpaRepository<DoctorSlotReleaseRule, Long> {

    List<DoctorSlotReleaseRule> findByDoctorBranch_IdAndIsActiveTrue(Long doctorBranchId);
    
    Optional<DoctorSlotReleaseRule> findByDoctorBranch_IdAndScopeAndIsActiveTrue(Long doctorBranchId, ReleaseRuleScope scope);
    
    Optional<DoctorSlotReleaseRule> findByDoctorBranch_IdAndScopeAndWeekdayAndIsActiveTrue(Long doctorBranchId, ReleaseRuleScope scope, Integer weekday);
    
    Optional<DoctorSlotReleaseRule> findByDoctorBranch_IdAndScopeAndTimeRange_IdAndIsActiveTrue(Long doctorBranchId, ReleaseRuleScope scope, Long timeRangeId);
    
    @Query("SELECT r FROM DoctorSlotReleaseRule r WHERE r.doctorBranch.id = :doctorBranchId AND r.isActive = true ORDER BY " +
           "CASE WHEN r.scope = 'TIME_RANGE' THEN 1 " +
           "WHEN r.scope = 'WEEKDAY' THEN 2 " +
           "WHEN r.scope = 'DEFAULT' THEN 3 END")
    List<DoctorSlotReleaseRule> findActiveRulesByPriority(@Param("doctorBranchId") Long doctorBranchId);
    
    boolean existsByDoctorBranch_IdAndScopeAndWeekdayAndIsActiveTrue(Long doctorBranchId, ReleaseRuleScope scope, Integer weekday);
    
    boolean existsByDoctorBranch_IdAndScopeAndTimeRange_IdAndIsActiveTrue(Long doctorBranchId, ReleaseRuleScope scope, Long timeRangeId);
}
