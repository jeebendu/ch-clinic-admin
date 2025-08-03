
package com.jee.clinichub.app.doctor.slotReleaseRules.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.jee.clinichub.app.doctor.slotReleaseRules.model.DoctorSlotReleaseRule;
import com.jee.clinichub.app.doctor.slotReleaseRules.model.DoctorSlotReleaseRuleDTO;
import com.jee.clinichub.global.model.Status;

public interface DoctorSlotReleaseRuleService {
    
    Status saveOrUpdate(DoctorSlotReleaseRuleDTO ruleDTO);
    
    Status saveOrUpdateBatch(List<DoctorSlotReleaseRuleDTO> ruleDTOs, Long doctorBranchId);
    
    Status deleteById(Long id);
    
    DoctorSlotReleaseRuleDTO getById(Long id);
    
    List<DoctorSlotReleaseRuleDTO> getByDoctorBranchId(Long doctorBranchId);
    
    DoctorSlotReleaseRule resolveReleaseRule(Long doctorBranchId, LocalDate slotDate, LocalTime slotTime, Long timeRangeId);
    
    boolean shouldReleaseSlot(DoctorSlotReleaseRule rule, LocalDate slotDate, LocalTime slotTime);
    
    Status createDefaultRule(Long doctorBranchId);
}
