
package com.jee.clinichub.app.doctor.slotReleaseRules.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.slotReleaseRules.model.DoctorSlotReleaseRule;
import com.jee.clinichub.app.doctor.slotReleaseRules.model.DoctorSlotReleaseRuleDTO;
import com.jee.clinichub.app.doctor.slotReleaseRules.model.ReleaseRuleScope;
import com.jee.clinichub.app.doctor.slotReleaseRules.repository.DoctorSlotReleaseRuleRepository;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange;
import com.jee.clinichub.app.doctor.timeRange.repository.DoctorTimeRangeRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class DoctorSlotReleaseRuleServiceImpl implements DoctorSlotReleaseRuleService {

    private final DoctorSlotReleaseRuleRepository ruleRepository;
    private final DoctorBranchRepo doctorBranchRepository;
    private final DoctorTimeRangeRepository timeRangeRepository;

    @Override
    @Transactional
    public Status saveOrUpdate(DoctorSlotReleaseRuleDTO ruleDTO) {
        try {
            validateRule(ruleDTO);
            
            DoctorSlotReleaseRule rule;
            if (ruleDTO.getId() != null) {
                rule = ruleRepository.findById(ruleDTO.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Rule not found with ID: " + ruleDTO.getId()));
                updateRuleFields(rule, ruleDTO);
            } else {
                rule = new DoctorSlotReleaseRule(ruleDTO);
                setRuleReferences(rule, ruleDTO);
            }
            
            ruleRepository.save(rule);
            return new Status(true, "Release rule saved successfully");
            
        } catch (Exception e) {
            log.error("Error saving release rule: {}", e.getMessage(), e);
            return new Status(false, "Failed to save release rule: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Status saveOrUpdateBatch(List<DoctorSlotReleaseRuleDTO> ruleDTOs, Long doctorBranchId) {
        try {
            // Deactivate existing rules
            List<DoctorSlotReleaseRule> existingRules = ruleRepository.findByDoctorBranch_IdAndIsActiveTrue(doctorBranchId);
            existingRules.forEach(rule -> rule.setIsActive(false));
            ruleRepository.saveAll(existingRules);
            
            // Save new rules
            for (DoctorSlotReleaseRuleDTO ruleDTO : ruleDTOs) {
                ruleDTO.setDoctorBranch(new DoctorBranchDto());
                ruleDTO.getDoctorBranch().setId(doctorBranchId);
                saveOrUpdate(ruleDTO);
            }
            
            return new Status(true, "Release rules updated successfully");
            
        } catch (Exception e) {
            log.error("Error updating release rules: {}", e.getMessage(), e);
            return new Status(false, "Failed to update release rules: " + e.getMessage());
        }
    }

    @Override
    public Status deleteById(Long id) {
        try {
            DoctorSlotReleaseRule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rule not found with ID: " + id));
            
            rule.setIsActive(false);
            ruleRepository.save(rule);
            
            return new Status(true, "Release rule deleted successfully");
            
        } catch (Exception e) {
            log.error("Error deleting release rule: {}", e.getMessage(), e);
            return new Status(false, "Failed to delete release rule");
        }
    }

    @Override
    public DoctorSlotReleaseRuleDTO getById(Long id) {
        DoctorSlotReleaseRule rule = ruleRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Rule not found with ID: " + id));
        return new DoctorSlotReleaseRuleDTO(rule);
    }

    @Override
    public List<DoctorSlotReleaseRuleDTO> getByDoctorBranchId(Long doctorBranchId) {
        return ruleRepository.findByDoctorBranch_IdAndIsActiveTrue(doctorBranchId)
            .stream()
            .map(DoctorSlotReleaseRuleDTO::new)
            .toList();
    }

    @Override
    public DoctorSlotReleaseRule resolveReleaseRule(Long doctorBranchId, LocalDate slotDate, LocalTime slotTime, Long timeRangeId) {
        List<DoctorSlotReleaseRule> rules = ruleRepository.findActiveRulesByPriority(doctorBranchId);
        
        // Priority: TIME_RANGE > WEEKDAY > DEFAULT
        for (DoctorSlotReleaseRule rule : rules) {
            if (rule.getScope() == ReleaseRuleScope.TIME_RANGE && 
                timeRangeId != null && 
                rule.getTimeRange() != null && 
                rule.getTimeRange().getId().equals(timeRangeId)) {
                return rule;
            }
            
            if (rule.getScope() == ReleaseRuleScope.WEEKDAY && 
                rule.getWeekday() != null && 
                rule.getWeekday().equals(slotDate.getDayOfWeek().getValue() % 7)) { // Convert to 0-6 format
                return rule;
            }
            
            if (rule.getScope() == ReleaseRuleScope.DEFAULT) {
                return rule;
            }
        }
        
        // Fallback: create default rule if none exists
        createDefaultRule(doctorBranchId);
        return ruleRepository.findByDoctorBranch_IdAndScopeAndIsActiveTrue(doctorBranchId, ReleaseRuleScope.DEFAULT)
            .orElse(null);
    }

    @Override
    public boolean shouldReleaseSlot(DoctorSlotReleaseRule rule, LocalDate slotDate, LocalTime slotTime) {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        
        // Calculate release date
        LocalDate releaseDate = slotDate.minusDays(rule.getReleaseDaysBefore());
        
        // Check if release date has passed
        if (currentDate.isAfter(releaseDate)) {
            return true;
        }
        
        if (currentDate.equals(releaseDate)) {
            // Check if release time has passed
            if (rule.getReleaseMinutesBeforeSlot() != null) {
                LocalTime slotReleaseTime = slotTime.minusMinutes(rule.getReleaseMinutesBeforeSlot());
                return currentTime.isAfter(slotReleaseTime) || currentTime.equals(slotReleaseTime);
            } else {
                return currentTime.isAfter(rule.getReleaseTime()) || currentTime.equals(rule.getReleaseTime());
            }
        }
        
        return false;
    }

    @Override
    public Status createDefaultRule(Long doctorBranchId) {
        try {
            // Check if default rule already exists
            Optional<DoctorSlotReleaseRule> existingDefault = ruleRepository
                .findByDoctorBranch_IdAndScopeAndIsActiveTrue(doctorBranchId, ReleaseRuleScope.DEFAULT);
            
            if (existingDefault.isPresent()) {
                return new Status(true, "Default rule already exists");
            }
            
            DoctorBranch doctorBranch = doctorBranchRepository.findById(doctorBranchId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor branch not found"));
            
            DoctorSlotReleaseRule defaultRule = new DoctorSlotReleaseRule();
            defaultRule.setDoctorBranch(doctorBranch);
            defaultRule.setScope(ReleaseRuleScope.DEFAULT);
            defaultRule.setReleaseDaysBefore(1);
            defaultRule.setReleaseTime(LocalTime.of(6, 0));
            defaultRule.setIsActive(true);
            
            ruleRepository.save(defaultRule);
            return new Status(true, "Default rule created successfully");
            
        } catch (Exception e) {
            log.error("Error creating default rule: {}", e.getMessage(), e);
            return new Status(false, "Failed to create default rule");
        }
    }

    private void validateRule(DoctorSlotReleaseRuleDTO ruleDTO) {
        if (ruleDTO.getScope() == ReleaseRuleScope.WEEKDAY && ruleDTO.getWeekday() == null) {
            throw new IllegalArgumentException("Weekday is required for WEEKDAY scope");
        }
        
        if (ruleDTO.getScope() == ReleaseRuleScope.TIME_RANGE && ruleDTO.getTimeRange() == null) {
            throw new IllegalArgumentException("Time range is required for TIME_RANGE scope");
        }
        
        if (ruleDTO.getReleaseDaysBefore() != null && ruleDTO.getReleaseDaysBefore() < 0) {
            throw new IllegalArgumentException("Release days before cannot be negative");
        }
    }

    private void updateRuleFields(DoctorSlotReleaseRule rule, DoctorSlotReleaseRuleDTO dto) {
        rule.setScope(dto.getScope());
        rule.setWeekday(dto.getWeekday());
        rule.setReleaseDaysBefore(dto.getReleaseDaysBefore());
        rule.setReleaseTime(dto.getReleaseTime());
        rule.setReleaseMinutesBeforeSlot(dto.getReleaseMinutesBeforeSlot());
        rule.setIsActive(dto.getIsActive());
        
        if (dto.getTimeRange() != null && dto.getTimeRange().getId() != null) {
            DoctorTimeRange timeRange = timeRangeRepository.findById(dto.getTimeRange().getId())
                .orElseThrow(() -> new EntityNotFoundException("Time range not found"));
            rule.setTimeRange(timeRange);
        }
    }

    private void setRuleReferences(DoctorSlotReleaseRule rule, DoctorSlotReleaseRuleDTO dto) {
        DoctorBranch doctorBranch = doctorBranchRepository.findById(dto.getDoctorBranch().getId())
            .orElseThrow(() -> new EntityNotFoundException("Doctor branch not found"));
        rule.setDoctorBranch(doctorBranch);
        
        if (dto.getTimeRange() != null && dto.getTimeRange().getId() != null) {
            DoctorTimeRange timeRange = timeRangeRepository.findById(dto.getTimeRange().getId())
                .orElseThrow(() -> new EntityNotFoundException("Time range not found"));
            rule.setTimeRange(timeRange);
        }
    }
}
